const contentService = require('./content.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success } = require('../../shared/utils/apiResponse');

const getHealthContent = asyncHandler(async (req, res) => {
  const data = await contentService.getHealthContent();
  success(res, 200, data);
});

module.exports = { getHealthContent };