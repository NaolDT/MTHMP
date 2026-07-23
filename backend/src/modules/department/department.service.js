const Department = require('./department.model');
const ApiError = require('../../shared/utils/ApiError');
const auditService = require('../audit/audit.service');

async function createDepartment(tenantId, input, req) {
  const existing = await Department.findOne({ name: input.name }).setOptions({ tenantId });
  if (existing) throw ApiError.conflict('A department with this name already exists');

  const department = await Department.create({ ...input, tenantId });

  await auditService.record({
    tenantId,
    userId: req.user.id,
    action: 'CREATE',
    resource: 'DEPARTMENT',
    resourceId: department._id,
    req,
    details: { name: department.name },
  });

  return department;
}

async function listDepartments(tenantId, { activeOnly } = {}) {
  const filter = {};
  if (activeOnly === 'true') filter.isActive = true;
  return Department.find(filter).setOptions({ tenantId }).sort({ name: 1 });
}

async function getDepartment(tenantId, id) {
  const department = await Department.findOne({ _id: id }).setOptions({ tenantId });
  if (!department) throw ApiError.notFound('Department not found');
  return department;
}

async function updateDepartment(tenantId, id, updates, req) {
  const department = await Department.findOneAndUpdate({ _id: id }, updates, {
    new: true,
    runValidators: true,
  }).setOptions({ tenantId });

  if (!department) throw ApiError.notFound('Department not found');

  await auditService.record({
    tenantId,
    userId: req.user.id,
    action: 'UPDATE',
    resource: 'DEPARTMENT',
    resourceId: department._id,
    req,
    changes: updates,
  });

  return department;
}

async function setDepartmentActive(tenantId, id, isActive, req) {
  const department = await Department.findOneAndUpdate({ _id: id }, { isActive }, { new: true }).setOptions({
    tenantId,
  });
  if (!department) throw ApiError.notFound('Department not found');

  await auditService.record({
    tenantId,
    userId: req.user.id,
    action: 'UPDATE',
    resource: 'DEPARTMENT',
    resourceId: department._id,
    req,
    details: { isActive },
  });

  return department;
}

module.exports = { createDepartment, listDepartments, getDepartment, updateDepartment, setDepartmentActive };