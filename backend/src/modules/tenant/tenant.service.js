const mongoose = require('mongoose');
const Tenant = require('./tenant.model');
const User = require('../user/user.model');
const ApiError = require('../../shared/utils/ApiError');
const auditService = require('../audit/audit.service');

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function createTenant({ name, adminEmail, adminPassword, adminFirstName, adminLastName, timezone }, req) {
  const baseSlug = slugify(name);
  const existing = await Tenant.findOne({ slug: baseSlug });
  const slug = existing ? `${baseSlug}-${Date.now().toString(36)}` : baseSlug;

  const session = await mongoose.startSession();
  try {
    let tenant, admin;
    await session.withTransaction(async () => {
      [tenant] = await Tenant.create(
        [{ name, slug, settings: { timezone: timezone || 'UTC' } }],
        { session }
      );

      const passwordHash = await User.hashPassword(adminPassword);
      [admin] = await User.create(
        [
          {
            tenantId: tenant._id,
            email: adminEmail,
            passwordHash,
            role: 'admin',
            firstName: adminFirstName,
            lastName: adminLastName,
          },
        ],
        { session }
      );
    });

    await auditService.record({
      tenantId: tenant._id,
      userId: req.user.id,
      action: 'CREATE',
      resource: 'TENANT',
      resourceId: tenant._id,
      req,
      details: { name, slug },
    });

    return { tenant, admin: admin.toSafeJSON() };
  } finally {
    session.endSession();
  }
}

async function setTenantActive(tenantId, isActive, req) {
  const tenant = await Tenant.findByIdAndUpdate(tenantId, { isActive }, { new: true });
  if (!tenant) throw ApiError.notFound('Tenant not found');

  await auditService.record({
    tenantId: tenant._id,
    userId: req.user.id,
    action: 'UPDATE',
    resource: 'TENANT',
    resourceId: tenant._id,
    req,
    details: { isActive },
  });

  return tenant;
}

async function listTenants({ page = 1, limit = 20 }) {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    Tenant.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
    Tenant.countDocuments(),
  ]);
  return { data, pagination: { page: Number(page), limit: Number(limit), total } };
}

module.exports = { createTenant, setTenantActive, listTenants };