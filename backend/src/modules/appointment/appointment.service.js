const Appointment = require('./appointment.model');
const Doctor = require('../doctor/doctor.model');
const Patient = require('../patient/patient.model');
const ApiError = require('../../shared/utils/ApiError');
const auditService = require('../audit/audit.service');
const notificationService = require('../notification/notification.service');
const {
  toMinutes,
  toHHMM,
  dayNameFromDateString,
  combineDateAndTime,
  rangesOverlap,
} = require('./appointment.utils');

const CANCELLATION_NOTICE_HOURS = 24; 

async function resolvePatientProfile(tenantId, userId) {
  const patient = await Patient.findOne({ userId }).setOptions({ tenantId });
  if (!patient) throw ApiError.notFound('Patient profile not found for this account');
  return patient;
}

async function resolveDoctorProfile(tenantId, userId) {
  const doctor = await Doctor.findOne({ userId }).setOptions({ tenantId });
  if (!doctor) throw ApiError.notFound('Doctor profile not found for this account');
  return doctor;
}


async function generateSlots(tenantId, doctorId, dateStr) {
  const doctor = await Doctor.findOne({ _id: doctorId, isActive: true }).setOptions({ tenantId });
  if (!doctor) throw ApiError.notFound('Doctor not found or inactive');

  const dayName = dayNameFromDateString(dateStr);
  const dayAvailability = doctor.availability.filter((slot) => slot.day === dayName && slot.isAvailable);

  if (dayAvailability.length === 0) {
    return [];
  }

  const existing = await Appointment.find({
    doctorId,
    date: combineDateAndTime(dateStr, '00:00'),
    status: 'booked',
  }).setOptions({ tenantId });

  const bookedRanges = existing.map((a) => [toMinutes(a.startTime), toMinutes(a.endTime)]);

  const slots = [];
  for (const window of dayAvailability) {
    let cursor = toMinutes(window.startTime);
    const windowEnd = toMinutes(window.endTime);

    while (cursor + doctor.consultationDuration <= windowEnd) {
      const slotStart = cursor;
      const slotEnd = cursor + doctor.consultationDuration;
      const isBooked = bookedRanges.some(([bStart, bEnd]) => rangesOverlap(slotStart, slotEnd, bStart, bEnd));

      slots.push({
        startTime: toHHMM(slotStart),
        endTime: toHHMM(slotEnd),
        available: !isBooked,
      });

      cursor = slotEnd;
    }
  }

  return slots;
}

async function bookAppointment(tenantId, input, requestingUser, req) {
  const doctor = await Doctor.findOne({ _id: input.doctorId, isActive: true }).setOptions({ tenantId });
  if (!doctor) throw ApiError.notFound('Doctor not found or inactive');

  const appointmentStart = combineDateAndTime(input.date, input.startTime);
  if (appointmentStart <= new Date()) {
    throw ApiError.badRequest('Cannot book an appointment in the past');
  }

  let patientId;
  if (requestingUser.role === 'patient') {
    const patient = await resolvePatientProfile(tenantId, requestingUser.id);
    patientId = patient._id;
  } else {
    if (!input.patientId) throw ApiError.badRequest('patientId is required when booking on behalf of a patient');
    const patient = await Patient.findOne({ _id: input.patientId }).setOptions({ tenantId });
    if (!patient) throw ApiError.notFound('Patient not found');
    patientId = patient._id;
  }

  const dayName = dayNameFromDateString(input.date);
  const window = doctor.availability.find(
    (slot) =>
      slot.day === dayName &&
      slot.isAvailable &&
      toMinutes(input.startTime) >= toMinutes(slot.startTime) &&
      toMinutes(input.startTime) + doctor.consultationDuration <= toMinutes(slot.endTime)
  );
  if (!window) {
    throw ApiError.badRequest('Requested time is outside the doctor\'s availability');
  }

  const startMinutes = toMinutes(input.startTime);
  const endMinutes = startMinutes + doctor.consultationDuration;
  const dateAtMidnight = combineDateAndTime(input.date, '00:00');

  const conflicting = await Appointment.find({
    doctorId: doctor._id,
    date: dateAtMidnight,
    status: 'booked',
  }).setOptions({ tenantId });

  const hasConflict = conflicting.some((a) =>
    rangesOverlap(startMinutes, endMinutes, toMinutes(a.startTime), toMinutes(a.endTime))
  );
  if (hasConflict) {
    throw ApiError.conflict('This slot was just booked by someone else — please choose another');
  }

  const appointment = await Appointment.create({
    tenantId,
    patientId,
    doctorId: doctor._id,
    departmentId: doctor.departmentId,
    date: dateAtMidnight,
    startTime: input.startTime,
    endTime: toHHMM(endMinutes),
    reasonForVisit: input.reasonForVisit,
    bookedBy: requestingUser.id,
  });

  const [patientWithUser, doctorWithUser] = await Promise.all([
    require('../patient/patient.model')
      .findOne({ _id: patientId })
      .setOptions({ tenantId })
      .populate('userId', 'firstName lastName email'),
    require('../doctor/doctor.model')
      .findOne({ _id: doctor._id })
      .setOptions({ tenantId })
      .populate('userId', 'firstName lastName'),
  ]);
  notificationService.sendAppointmentBooked({
    patientEmail: patientWithUser.userId.email,
    patientName: `${patientWithUser.userId.firstName} ${patientWithUser.userId.lastName}`,
    doctorName: `${doctorWithUser.userId.firstName} ${doctorWithUser.userId.lastName}`,
    date: dateAtMidnight,
    startTime: input.startTime,
  });

  await auditService.record({
    tenantId,
    userId: requestingUser.id,
    action: 'CREATE',
    resource: 'APPOINTMENT',
    resourceId: appointment._id,
    req,
    details: { doctorId: doctor._id.toString(), date: input.date, startTime: input.startTime },
  });

  return appointment;
}

async function listAppointments(tenantId, requestingUser, filters = {}) {
  const query = {};

  if (requestingUser.role === 'patient') {
    const patient = await resolvePatientProfile(tenantId, requestingUser.id);
    query.patientId = patient._id;
  } else if (requestingUser.role === 'doctor') {
    const doctor = await resolveDoctorProfile(tenantId, requestingUser.id);
    query.doctorId = doctor._id;
  } else {
    if (filters.patientId) query.patientId = filters.patientId;
    if (filters.doctorId) query.doctorId = filters.doctorId;
  }

  if (filters.status) query.status = filters.status;
  if (filters.date) query.date = combineDateAndTime(filters.date, '00:00');

  return Appointment.find(query)
    .setOptions({ tenantId })
    .populate({ path: 'patientId', select: 'userId phone', options: { tenantId } })
    .populate({ path: 'doctorId', select: 'userId specialization', options: { tenantId } })
    .populate({ path: 'departmentId', select: 'name', options: { tenantId } })
    .sort({ date: -1, startTime: 1 });
}

async function getAppointment(tenantId, id, requestingUser) {
  const appointment = await Appointment.findOne({ _id: id })
    .setOptions({ tenantId })
    .populate({ path: 'patientId', select: 'userId phone', options: { tenantId } })
    .populate({ path: 'doctorId', select: 'userId specialization', options: { tenantId } });

  if (!appointment) throw ApiError.notFound('Appointment not found');

  if (requestingUser.role === 'patient') {
    const patient = await resolvePatientProfile(tenantId, requestingUser.id);
    if (appointment.patientId._id.toString() !== patient._id.toString()) {
      throw ApiError.forbidden('You can only view your own appointments');
    }
  } else if (requestingUser.role === 'doctor') {
    const doctor = await resolveDoctorProfile(tenantId, requestingUser.id);
    if (appointment.doctorId._id.toString() !== doctor._id.toString()) {
      throw ApiError.forbidden('You can only view your own appointments');
    }
  }

  return appointment;
}


async function cancelAppointment(tenantId, id, reason, requestingUser, req) {
  const appointment = await Appointment.findOne({ _id: id }).setOptions({ tenantId });
  if (!appointment) throw ApiError.notFound('Appointment not found');
  if (appointment.status !== 'booked') {
    throw ApiError.badRequest(`Cannot cancel an appointment with status "${appointment.status}"`);
  }

  const appointmentStart = combineDateAndTime(
    appointment.date.toISOString().slice(0, 10),
    appointment.startTime
  );
  const hoursUntilAppointment = (appointmentStart - new Date()) / (1000 * 60 * 60);
  const isLateCancellation = hoursUntilAppointment < CANCELLATION_NOTICE_HOURS;

  let overridden = false;

  if (requestingUser.role === 'patient') {
    const patient = await resolvePatientProfile(tenantId, requestingUser.id);
    if (appointment.patientId.toString() !== patient._id.toString()) {
      throw ApiError.forbidden('You can only cancel your own appointments');
    }
    if (isLateCancellation) {
      throw ApiError.badRequest(
        `Appointments can only be cancelled at least ${CANCELLATION_NOTICE_HOURS} hours in advance. Please contact the hospital directly for late changes.`
      );
    }
  } else {
    if (isLateCancellation) {
      if (!reason || !reason.trim()) {
        throw ApiError.badRequest(
          'A reason is required to cancel within 24 hours of the appointment (BR-004 override)'
        );
      }
      overridden = true;
    }
  }

  appointment.status = 'cancelled';
  appointment.cancellation = {
    reason: reason || '',
    cancelledBy: requestingUser.id,
    cancelledAt: new Date(),
    overridden,
  };
  await appointment.save();

  const [patientWithUser, doctorWithUser] = await Promise.all([
    require('../patient/patient.model')
      .findOne({ _id: appointment.patientId })
      .setOptions({ tenantId })
      .populate('userId', 'firstName lastName email'),
    require('../doctor/doctor.model')
      .findOne({ _id: appointment.doctorId })
      .setOptions({ tenantId })
      .populate('userId', 'firstName lastName'),
  ]);
  notificationService.sendAppointmentCancelled({
    patientEmail: patientWithUser.userId.email,
    patientName: `${patientWithUser.userId.firstName} ${patientWithUser.userId.lastName}`,
    doctorName: `${doctorWithUser.userId.firstName} ${doctorWithUser.userId.lastName}`,
    date: appointment.date,
    startTime: appointment.startTime,
    reason: appointment.cancellation.reason,
    overridden: appointment.cancellation.overridden,
  });

  await auditService.record({
    tenantId,
    userId: requestingUser.id,
    action: 'UPDATE',
    resource: 'APPOINTMENT',
    resourceId: appointment._id,
    req,
    details: { action: 'cancel', reason, overridden },
  });

  return appointment;
}

async function updateAppointmentStatus(tenantId, id, status, requestingUser, req) {
  const appointment = await Appointment.findOne({ _id: id }).setOptions({ tenantId });
  if (!appointment) throw ApiError.notFound('Appointment not found');
  if (appointment.status !== 'booked') {
    throw ApiError.badRequest(`Cannot mark a "${appointment.status}" appointment as ${status}`);
  }

  if (requestingUser.role === 'doctor') {
    const doctor = await resolveDoctorProfile(tenantId, requestingUser.id);
    if (appointment.doctorId.toString() !== doctor._id.toString()) {
      throw ApiError.forbidden('You can only update your own appointments');
    }
  }

  appointment.status = status;
  await appointment.save();

  await auditService.record({
    tenantId,
    userId: requestingUser.id,
    action: 'UPDATE',
    resource: 'APPOINTMENT',
    resourceId: appointment._id,
    req,
    details: { status },
  });

  return appointment;
}

module.exports = {
  generateSlots,
  bookAppointment,
  listAppointments,
  getAppointment,
  cancelAppointment,
  updateAppointmentStatus,
};