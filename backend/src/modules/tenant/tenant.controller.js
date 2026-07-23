const tenantService = require('./tenant.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success } = require('../../shared/utils/apiResponse');

const create = asyncHandler(async (req, res) => {
  const result = await tenantService.createTenant(req.body, req);
  success(res, 201, result);
});

const setActive = asyncHandler(async (req, res) => {
  const tenant = await tenantService.setTenantActive(req.params.id, req.body.isActive, req);
  success(res, 200, tenant);
});

const list = asyncHandler(async (req, res) => {
  const result = await tenantService.listTenants(req.query);
  success(res, 200, result.data, result.pagination);
});

module.exports = { create, setActive, list };