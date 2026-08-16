const hospitalProfileService = require('./hospitalProfile.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success } = require('../../shared/utils/apiResponse');

const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await hospitalProfileService.getOrCreateProfile(req.tenantId);
  success(res, 200, profile);
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const profile = await hospitalProfileService.updateProfile(req.tenantId, req.body, req);
  success(res, 200, profile);
});

const submitForReview = asyncHandler(async (req, res) => {
  const profile = await hospitalProfileService.submitForReview(req.tenantId, req);
  success(res, 200, profile);
});
const listPending = asyncHandler(async (req, res) => {
  const profiles = await hospitalProfileService.listPendingProfiles();
  success(res, 200, profiles);
});

const approve = asyncHandler(async (req, res) => {
  const profile = await hospitalProfileService.approveProfile(req.params.id, req);
  success(res, 200, profile);
});

const reject = asyncHandler(async (req, res) => {
  const profile = await hospitalProfileService.rejectProfile(req.params.id, req.body.reason, req);
  success(res, 200, profile);
});

module.exports = { getMyProfile, updateMyProfile, submitForReview, listPending, approve, reject };