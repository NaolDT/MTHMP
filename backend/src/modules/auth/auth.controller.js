const authService = require('./auth.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success } = require('../../shared/utils/apiResponse');

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body, req);
  success(res, 200, result);
});

const refresh = asyncHandler(async (req, res) => {
  const tokens = await authService.refresh(req.body.refreshToken);
  success(res, 200, tokens);
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);
  success(res, 200, { message: 'Logged out' });
});

const registerPatient = asyncHandler(async (req, res) => {
  const patient = await authService.registerPatient(req.body, req);
  success(res, 201, patient);
});

const me = asyncHandler(async (req, res) => {
  success(res, 200, req.user);
});

module.exports = { login, refresh, logout, registerPatient, me };