const userService = require('./user.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success } = require('../../shared/utils/apiResponse');

const createStaff = asyncHandler(async (req, res) => {
  const user = await userService.createStaff(req.tenantId, req.body, req);
  success(res, 201, user);
});

const listStaff = asyncHandler(async (req, res) => {
  const staff = await userService.listStaff(req.tenantId, req.query);
  success(res, 200, staff);
});

module.exports = { createStaff, listStaff };