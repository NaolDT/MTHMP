const mongoose = require('mongoose');
const Patient = require('./patient.model');
const User = require('../user/user.model');
const ApiError = require('../../shared/utils/ApiError');
const auditService = require('../audit/audit.service');

async function registerPatient(tenantId, input, req) {
  const session = await mongoose.startSession();
  try {
    let user, patient;
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
            role: 'patient',
            firstName: input.firstName,
            lastName: input.lastName,
            phone: input.phone,
          },
        ],
        { session }
      );

      [patient] = await Patient.create(
        [
          {
            tenantId,
            userId: user._id,
            phone: input.phone,
            dateOfBirth: input.dateOfBirth,
            gender: input.gender,
            address: input.address,
            emergencyContact: input.emergencyContact,
          },
        ],
        { session }
      );
    });

    await auditService.record({
      tenantId,
      userId: req.user.id,
      action: 'CREATE',
      resource: 'PATIENT',
      resourceId: patient._id,
      req,
      details: { self_registered: false, registeredBy: req.user.id },
    });

    return { patient, user: user.toSafeJSON() };
  } finally {
    session.endSession();
  }
}

async function listPatients(tenantId, { activeOnly } = {}) {
  const filter = {};
  if (activeOnly === 'true') filter.isActive = true;

  return Patient.find(filter)
    .setOptions({ tenantId })
    .populate('userId', 'firstName lastName email phone')
    .sort({ createdAt: -1 });
}

async function getPatient(tenantId, id, requestingUser) {
  const patient = await Patient.findOne({ _id: id })
    .setOptions({ tenantId })
    .populate('userId', 'firstName lastName email phone');

  if (!patient) throw ApiError.notFound('Patient not found');

  if (requestingUser.role === 'patient' && patient.userId._id.toString() !== requestingUser.id) {
    throw ApiError.forbidden('Patients can only view their own record');
  }

  return patient;
}

async function updatePatient(tenantId, id, updates, requestingUser, req) {
  const patient = await Patient.findOne({ _id: id }).setOptions({ tenantId });
  if (!patient) throw ApiError.notFound('Patient not found');

  if (requestingUser.role === 'patient' && patient.userId.toString() !== requestingUser.id) {
    throw ApiError.forbidden('Patients can only update their own record');
  }

  Object.assign(patient, updates);
  await patient.save();

  await auditService.record({
    tenantId,
    userId: requestingUser.id,
    action: 'UPDATE',
    resource: 'PATIENT',
    resourceId: patient._id,
    req,
    changes: updates,
  });

  return patient;
}

module.exports = { registerPatient, listPatients, getPatient, updatePatient };