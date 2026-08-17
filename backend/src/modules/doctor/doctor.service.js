const mongoose = require('mongoose');
const Doctor = require('./doctor.model');
const User = require('../user/user.model');
const Department = require('../department/department.model');
const ApiError = require('../../shared/utils/ApiError');
const auditService = require('../audit/audit.service');


async function createDoctor(tenantId, input, req) {
  const department = await Department.findOne({ _id: input.departmentId }).setOptions({ tenantId });
  if (!department) throw ApiError.notFound('Department not found');

  const session = await mongoose.startSession();
  try {
    let user, doctor;
    await session.withTransaction(async () => {
      const existing = await User.findOne({ email: input.email, tenantId })
        .setOptions({ skipTenantScope: true })
        .session(session);
      if (existing) throw ApiError.conflict('An account with this email already exists for this hospital');

      const passwordHash = await User.hashPassword(input.password);
      [user] = await User.create(
        [
          {
            tenantId,
            email: input.email,
            passwordHash,
            role: 'doctor',
            firstName: input.firstName,
            lastName: input.lastName,
            phone: input.phone,
          },
        ],
        { session }
      );

      [doctor] = await Doctor.create(
        [
          {
            tenantId,
            userId: user._id,
            departmentId: input.departmentId,
            specialization: input.specialization,
            qualifications: input.qualifications,
            experience: input.experience,
            consultationDuration: input.consultationDuration,
          },
        ],
        { session }
      );
    });

    await auditService.record({
      tenantId,
      userId: req.user.id,
      action: 'CREATE',
      resource: 'DOCTOR',
      resourceId: doctor._id,
      req,
      details: { email: user.email, departmentId: input.departmentId },
    });

    return { doctor, user: user.toSafeJSON() };
  } finally {
    session.endSession();
  }
}

async function listDoctors(tenantId, { departmentId, activeOnly } = {}) {
  const filter = {};
  if (departmentId) filter.departmentId = departmentId;
  if (activeOnly === 'true') filter.isActive = true;

  return Doctor.find(filter)
    .setOptions({ tenantId })
    .populate('userId', 'firstName lastName email phone')
    .populate({ path: 'departmentId', select: 'name', options: { tenantId } })
    .sort({ createdAt: -1 });
}

async function getDoctor(tenantId, id) {
  const doctor = await Doctor.findOne({ _id: id })
    .setOptions({ tenantId })
    .populate('userId', 'firstName lastName email phone')
    .populate({ path: 'departmentId', select: 'name', options: { tenantId } });

  if (!doctor) throw ApiError.notFound('Doctor not found');
  return doctor;
}

async function updateDoctor(tenantId, id, updates, req) {
  if (updates.departmentId) {
    const department = await Department.findOne({ _id: updates.departmentId }).setOptions({ tenantId });
    if (!department) throw ApiError.notFound('Department not found');
  }

  const doctor = await Doctor.findOneAndUpdate({ _id: id }, updates, {
    new: true,
    runValidators: true,
  }).setOptions({ tenantId });

  if (!doctor) throw ApiError.notFound('Doctor not found');

  await auditService.record({
    tenantId,
    userId: req.user.id,
    action: 'UPDATE',
    resource: 'DOCTOR',
    resourceId: doctor._id,
    req,
    changes: updates,
  });

  return doctor;
}

async function setDoctorActive(tenantId, id, isActive, req) {
  const doctor = await Doctor.findOneAndUpdate({ _id: id }, { isActive }, { new: true }).setOptions({ tenantId });
  if (!doctor) throw ApiError.notFound('Doctor not found');

  await auditService.record({
    tenantId,
    userId: req.user.id,
    action: 'UPDATE',
    resource: 'DOCTOR',
    resourceId: doctor._id,
    req,
    details: { isActive },
  });

  return doctor;
}

async function setAvailability(tenantId, id, availability, requestingUser, req) {
  const doctor = await Doctor.findOne({ _id: id }).setOptions({ tenantId });
  if (!doctor) throw ApiError.notFound('Doctor not found');

  if (requestingUser.role === 'doctor' && doctor.userId.toString() !== requestingUser.id) {
    throw ApiError.forbidden('Doctors can only set their own availability');
  }

  doctor.availability = availability;

  try {
    await doctor.save(); 
  } catch (err) {
   
    if (!err.statusCode) {
      throw ApiError.badRequest(err.message);
    }
    throw err;
  }

  await auditService.record({
    tenantId,
    userId: requestingUser.id,
    action: 'UPDATE',
    resource: 'AVAILABILITY',
    resourceId: doctor._id,
    req,
    changes: { availability },
  });

  return doctor;
}

/** A doctor viewing/editing their own professional profile — resolved by userId, not a route param. */
async function getMyProfile(tenantId, userId) {
  const doctor = await Doctor.findOne({ userId })
    .setOptions({ tenantId })
    .populate('userId', 'firstName lastName email phone')
    .populate({ path: 'departmentId', select: 'name', options: { tenantId } });

  if (!doctor) throw ApiError.notFound('Doctor profile not found for this account');
  return doctor;
}

async function updateMyProfile(tenantId, userId, updates) {
  const doctor = await Doctor.findOne({ userId }).setOptions({ tenantId });
  if (!doctor) throw ApiError.notFound('Doctor profile not found for this account');

  Object.assign(doctor, updates);
  await doctor.save();
  return doctor;
}

const Tenant = require('../tenant/tenant.model');

/** Public — no auth. Active doctors only, with only patient-facing fields exposed. */
async function listPublicDoctors(slug, { departmentId } = {}) {
  const tenant = await Tenant.findOne({ slug, isActive: true });
  if (!tenant) throw ApiError.notFound('Hospital not found');

  const filter = { isActive: true };
  if (departmentId) filter.departmentId = departmentId;

  return Doctor.find(filter)
    .setOptions({ tenantId: tenant._id })
    .select('specialization bio photoUrl education certifications languages experience departmentId userId')
    .populate('userId', 'firstName lastName')
    .populate({ path: 'departmentId', select: 'name', options: { tenantId: tenant._id } })
    .sort({ createdAt: -1 });
}

module.exports = { createDoctor, listDoctors, getDoctor, updateDoctor, setDoctorActive, setAvailability, getMyProfile, updateMyProfile, listPublicDoctors };