const departmentService = require('./department.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success } = require('../../shared/utils/apiResponse');

const create = asyncHandler(async (req, res) => {
  const department = await departmentService.createDepartment(req.tenantId, req.body, req);
  success(res, 201, department);
});

const list = asyncHandler(async (req, res) => {
  const departments = await departmentService.listDepartments(req.tenantId, req.query);
  success(res, 200, departments);
});

const getOne = asyncHandler(async (req, res) => {
  const department = await departmentService.getDepartment(req.tenantId, req.params.id);
  success(res, 200, department);
});

const update = asyncHandler(async (req, res) => {
  const department = await departmentService.updateDepartment(req.tenantId, req.params.id, req.body, req);
  success(res, 200, department);
});

const setActive = asyncHandler(async (req, res) => {
  const department = await departmentService.setDepartmentActive(req.tenantId, req.params.id, req.body.isActive, req);
  success(res, 200, department);
});

const listPublic = asyncHandler(async (req, res) => {
  const departments = await departmentService.listPublicDepartments(req.params.slug);
  success(res, 200, departments);
});

module.exports = { create, list, getOne, update, setActive, listPublic };