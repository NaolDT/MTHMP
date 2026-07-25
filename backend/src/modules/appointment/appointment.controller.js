const appointmentService = require('./appointment.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success } = require('../../shared/utils/apiResponse');

const getSlots = asyncHandler(async (req, res) => {
  const slots = await appointmentService.generateSlots(req.tenantId, req.query.doctorId, req.query.date);
  success(res, 200, slots);
});

const book = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.bookAppointment(req.tenantId, req.body, req.user, req);
  success(res, 201, appointment);
});

const list = asyncHandler(async (req, res) => {
  const appointments = await appointmentService.listAppointments(req.tenantId, req.user, req.query);
  success(res, 200, appointments);
});

const getOne = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.getAppointment(req.tenantId, req.params.id, req.user);
  success(res, 200, appointment);
});

const cancel = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.cancelAppointment(
    req.tenantId,
    req.params.id,
    req.body.reason,
    req.user,
    req
  );
  success(res, 200, appointment);
});

const updateStatus = asyncHandler(async (req, res) => {
  const appointment = await appointmentService.updateAppointmentStatus(
    req.tenantId,
    req.params.id,
    req.body.status,
    req.user,
    req
  );
  success(res, 200, appointment);
});

module.exports = { getSlots, book, list, getOne, cancel, updateStatus };