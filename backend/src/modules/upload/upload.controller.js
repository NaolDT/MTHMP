const uploadService = require('./upload.service');
const ApiError = require('../../shared/utils/ApiError');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success } = require('../../shared/utils/apiResponse');

const ALLOWED_CATEGORIES = ['hospital-logo', 'hospital-cover', 'hospital-gallery', 'doctor-photo'];

const uploadImage = asyncHandler(async (req, res) => {
  if (!req.file) throw ApiError.badRequest('No file was uploaded');

  const category = req.body.category;
  if (!ALLOWED_CATEGORIES.includes(category)) {
    throw ApiError.badRequest(`category must be one of: ${ALLOWED_CATEGORIES.join(', ')}`);
  }

  const result = await uploadService.uploadImage(req.file.buffer, { tenantId: req.tenantId, category });
  success(res, 201, result);
});

module.exports = { uploadImage };