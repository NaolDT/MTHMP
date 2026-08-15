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

const forgotPassword = asyncHandler(async (req, res) => {
  await authService.requestPasswordReset(req.body, req);
  success(res, 200, { message: 'If an account exists for that email, a password reset link has been sent.' });
});

const resetPassword = asyncHandler(async (req, res) => {
  await authService.resetPassword(req.body, req);
  success(res, 200, { message: 'Password updated. You can now log in with your new password.' });
});

module.exports = { login, refresh, logout, registerPatient, me, forgotPassword, resetPassword };