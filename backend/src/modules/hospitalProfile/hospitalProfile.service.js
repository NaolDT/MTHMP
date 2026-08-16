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
async function listPendingProfiles() {
  return HospitalProfile.find({ status: 'pending' })
    .setOptions({ skipTenantScope: true })
    .populate({ path: 'tenantId', select: 'name slug' })
    .sort({ submittedAt: 1 }); 
}

async function approveProfile(profileId, req) {
  const profile = await HospitalProfile.findById(profileId).setOptions({ skipTenantScope: true });
  if (!profile) throw ApiError.notFound('Hospital profile not found');
  if (profile.status !== 'pending') {
    throw ApiError.badRequest(`Cannot approve a profile with status "${profile.status}" — only pending profiles can be approved.`);
  }

  profile.status = 'published';
  profile.publishedAt = new Date();
  profile.rejectionReason = null;
  await profile.save();

  await auditService.record({
    tenantId: profile.tenantId,
    userId: req.user.id,
    action: 'APPROVE',
    resource: 'TENANT',
    resourceId: profile._id,
    req,
    details: { action: 'hospital_profile_approved' },
  });

  return profile;
}

async function rejectProfile(profileId, reason, req) {
  const profile = await HospitalProfile.findById(profileId).setOptions({ skipTenantScope: true });
  if (!profile) throw ApiError.notFound('Hospital profile not found');
  if (profile.status !== 'pending') {
    throw ApiError.badRequest(`Cannot reject a profile with status "${profile.status}" — only pending profiles can be rejected.`);
  }

  profile.status = 'draft';
  profile.submittedAt = null;
  profile.rejectionReason = reason;
  await profile.save();

  await auditService.record({
    tenantId: profile.tenantId,
    userId: req.user.id,
    action: 'REJECT',
    resource: 'TENANT',
    resourceId: profile._id,
    req,
    details: { action: 'hospital_profile_rejected', reason },
  });

  return profile;
}

module.exports = { getOrCreateProfile, updateProfile, submitForReview, listPendingProfiles, approveProfile, rejectProfile };