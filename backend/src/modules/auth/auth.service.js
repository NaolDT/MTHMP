const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

const User = require('../user/user.model');
const Tenant = require('../tenant/tenant.model');
const Patient = require('../patient/patient.model');
const ApiError = require('../../shared/utils/ApiError');
const auditService = require('../audit/audit.service');
const { jwt: jwtConfig } = require('../../config/env');

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

/**
 * Self-service patient registration against a specific hospital (tenant).
 * A separate receptionist-initiated "register patient on behalf of" flow
 * belongs in the patient module (Phase 6) and reuses the same pattern.
 */
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

module.exports = { login, refresh, logout, registerPatient, issueTokenPair };