const User = require('./user.model');
const ApiError = require('../../shared/utils/ApiError');
const auditService = require('../audit/audit.service');

async function createStaff(tenantId, input, req) {
  const existing = await User.findOne({ email: input.email, tenantId }).setOptions({ skipTenantScope: true });
  if (existing) throw ApiError.conflict('An account with this email already exists for this hospital');

  const passwordHash = await User.hashPassword(input.password);
  const user = await User.create({
    tenantId,
    email: input.email,
    passwordHash,
    role: input.role,
    firstName: input.firstName,
    lastName: input.lastName,
    phone: input.phone,
  });

  await auditService.record({
    tenantId,
    userId: req.user.id,
    action: 'CREATE',
    resource: 'USER',
    resourceId: user._id,
    req,
    details: { role: input.role, email: input.email },
  });

  return user.toSafeJSON();
}

async function listStaff(tenantId, { role } = {}) {
  const filter = { role: role || 'receptionist' };
  return User.find(filter).select('-passwordHash -refreshTokenHash').setOptions({ tenantId });
}

module.exports = { createStaff, listStaff };