const HospitalProfile = require('./hospitalProfile.model');
const ApiError = require('../../shared/utils/ApiError');
const auditService = require('../audit/audit.service');

async function getOrCreateProfile(tenantId) {
  let profile = await HospitalProfile.findOne({}).setOptions({ tenantId });
  if (!profile) {
    profile = await HospitalProfile.create({ tenantId });
  }
  return profile;
}

async function updateProfile(tenantId, updates, req) {
  const profile = await getOrCreateProfile(tenantId);

  Object.assign(profile, updates);

  if (profile.status !== 'draft') {
    profile.status = 'draft';
    profile.submittedAt = null;
    profile.rejectionReason = null;
  }

  await profile.save();

  await auditService.record({
    tenantId,
    userId: req.user.id,
    action: 'UPDATE',
    resource: 'TENANT', 
    resourceId: profile._id,
    req,
    details: { action: 'hospital_profile_updated', revertedToDraft: profile.status === 'draft' },
  });

  return profile;
}

async function submitForReview(tenantId, req) {
  const profile = await getOrCreateProfile(tenantId);

  if (profile.status !== 'draft') {
    throw ApiError.badRequest(`Profile is already "${profile.status}" — cannot resubmit.`);
  }

  profile.status = 'pending';
  profile.submittedAt = new Date();
  await profile.save();

  await auditService.record({
    tenantId,
    userId: req.user.id,
    action: 'UPDATE',
    resource: 'TENANT',
    resourceId: profile._id,
    req,
    details: { action: 'hospital_profile_submitted' },
  });

  return profile;
}

module.exports = { getOrCreateProfile, updateProfile, submitForReview };