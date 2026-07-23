const User = require('../modules/user/user.model');
const logger = require('../shared/utils/logger');
const { superAdmin } = require('./env');

async function ensureSuperAdmin() {
  const existing = await User.findOne({ role: 'super-admin' }).setOptions({ skipTenantScope: true });
  if (existing) return;

  const passwordHash = await User.hashPassword(superAdmin.password);
  await User.create({
    email: superAdmin.email,
    passwordHash,
    role: 'super-admin',
    firstName: 'Super',
    lastName: 'Admin',
    tenantId: null,
  });

  logger.info(`Bootstrapped super-admin account: ${superAdmin.email}`);
}

module.exports = { ensureSuperAdmin };