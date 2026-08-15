const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../user/user.model');
const Tenant = require('../tenant/tenant.model');
const Patient = require('../patient/patient.model');
const ApiError = require('../../shared/utils/ApiError');
const auditService = require('../audit/audit.service');
const crypto = require('crypto');
const notificationService = require('../notification/notification.service');
const { jwt: jwtConfig, clientUrl } = require('../../config/env');

function signAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), tenantId: user.tenantId ? user.tenantId.toString() : null, role: user.role },
    jwtConfig.accessSecret,
    { expiresIn: jwtConfig.accessExpires }
  );
}

function signRefreshToken(user) {
  return jwt.sign({ sub: user._id.toString() }, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpires });
}

async function issueTokenPair(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  user.lastLogin = new Date();
  await user.save({ validateModifiedOnly: true });
  return { accessToken, refreshToken };
}

async function login({ email, password, tenantSlug }, req) {
  let tenantId = null;

  if (tenantSlug) {
    const tenant = await Tenant.findOne({ slug: tenantSlug, isActive: true });
    if (!tenant) throw ApiError.notFound('Hospital not found or inactive');
    tenantId = tenant._id;
  }

  const query = tenantId ? { email, tenantId } : { email, role: 'super-admin' };
  const user = await User.findOne(query).select('+passwordHash').setOptions({ skipTenantScope: true });

  if (!user || !user.isActive) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const valid = await user.comparePassword(password);
  if (!valid) {
    await auditService.record({
      tenantId: user.tenantId,
      userId: user._id,
      action: 'LOGIN',
      resource: 'USER',
      resourceId: user._id,
      req,
      details: { outcome: 'failed', reason: 'bad_password' },
    });
    throw ApiError.unauthorized('Invalid credentials');
  }

  const tokens = await issueTokenPair(user);

  await auditService.record({
    tenantId: user.tenantId,
    userId: user._id,
    action: 'LOGIN',
    resource: 'USER',
    resourceId: user._id,
    req,
    details: { outcome: 'success' },
  });

  return { user: user.toSafeJSON(), ...tokens };
}

async function refresh(refreshToken) {
  let payload;
  try {
    payload = jwt.verify(refreshToken, jwtConfig.refreshSecret);
  } catch {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const user = await User.findById(payload.sub).select('+refreshTokenHash').setOptions({ skipTenantScope: true });
  if (!user || !user.isActive || !user.refreshTokenHash) {
    throw ApiError.unauthorized('Invalid session');
  }

  const matches = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!matches) {
    // Refresh token reuse/mismatch: revoke the session outright.
    user.refreshTokenHash = null;
    await user.save({ validateModifiedOnly: true });
    throw ApiError.unauthorized('Session revoked, please log in again');
  }

  const tokens = await issueTokenPair(user);
  return tokens;
}

async function logout(userId) {
  await User.findByIdAndUpdate(userId, { refreshTokenHash: null }).setOptions({ skipTenantScope: true });
}


async function registerPatient(input, req) {
  const tenant = await Tenant.findOne({ slug: input.tenantSlug, isActive: true });
  if (!tenant) throw ApiError.notFound('Hospital not found or inactive');
  if (!tenant.settings.features.allowOnlineBooking) {
    throw ApiError.forbidden('This hospital does not accept online patient registration');
  }

  const session = await mongoose.startSession();
  try {
    let createdUser;
    await session.withTransaction(async () => {
      const existing = await User.findOne({ email: input.email, tenantId: tenant._id })
        .setOptions({ skipTenantScope: true })
        .session(session);
      if (existing) throw ApiError.conflict('An account with this email already exists for this hospital');

      const passwordHash = await User.hashPassword(input.password);
      const [user] = await User.create(
        [
          {
            tenantId: tenant._id,
            email: input.email,
            passwordHash,
            role: 'patient',
            firstName: input.firstName,
            lastName: input.lastName,
            phone: input.phone,
          },
        ],
        { session }
      );

      await Patient.create(
        [
          {
            tenantId: tenant._id,
            userId: user._id,
            phone: input.phone,
            dateOfBirth: input.dateOfBirth,
            gender: input.gender,
          },
        ],
        { session }
      );

      createdUser = user;
    });

    await auditService.record({
      tenantId: tenant._id,
      userId: createdUser._id,
      action: 'CREATE',
      resource: 'PATIENT',
      resourceId: createdUser._id,
      req,
      details: { self_registered: true },
    });

    return createdUser.toSafeJSON();
  } finally {
    session.endSession();
  }
}

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; 

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

async function requestPasswordReset({ email, tenantSlug }, req) {
  let tenantId = null;
  if (tenantSlug) {
    const tenant = await Tenant.findOne({ slug: tenantSlug, isActive: true });
    if (!tenant) return;
    tenantId = tenant._id;
  }

  const query = tenantId ? { email, tenantId } : { email, role: 'super-admin' };
  const user = await User.findOne(query).setOptions({ skipTenantScope: true });

  if (!user || !user.isActive) return;

  const rawToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = hashToken(rawToken);
  user.resetPasswordExpires = new Date(Date.now() + RESET_TOKEN_TTL_MS);
  await user.save({ validateModifiedOnly: true });

  const resetUrl = `${clientUrl}/reset-password?token=${rawToken}`;
  await notificationService.sendPasswordReset({ to: user.email, firstName: user.firstName, resetUrl });

  await auditService.record({
    tenantId: user.tenantId,
    userId: user._id,
    action: 'UPDATE',
    resource: 'USER',
    resourceId: user._id,
    req,
    details: { action: 'password_reset_requested' },
  });
}

async function resetPassword({ token, password }, req) {
  const hashedToken = hashToken(token);
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpires: { $gt: new Date() },
  })
    .select('+resetPasswordToken +resetPasswordExpires')
    .setOptions({ skipTenantScope: true });

  if (!user) {
    throw ApiError.badRequest('This reset link is invalid or has expired. Please request a new one.');
  }

  user.passwordHash = await User.hashPassword(password);
  user.resetPasswordToken = null;
  user.resetPasswordExpires = null;
  user.refreshTokenHash = null; // revoke existing sessions on password change
  await user.save({ validateModifiedOnly: true });

  await auditService.record({
    tenantId: user.tenantId,
    userId: user._id,
    action: 'UPDATE',
    resource: 'USER',
    resourceId: user._id,
    req,
    details: { action: 'password_reset_completed' },
  });
}

module.exports = { login, refresh, logout, registerPatient, issueTokenPair, requestPasswordReset, resetPassword };