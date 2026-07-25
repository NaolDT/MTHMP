const Joi = require('joi');

const dateRule = Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/); // "YYYY-MM-DD"

const getSlots = Joi.object({
  doctorId: Joi.string().required(),
  date: dateRule.required(),
});

const bookAppointment = Joi.object({
  doctorId: Joi.string().required(),
  date: dateRule.required(),
  startTime: Joi.string()
    .pattern(/^([01]\d|2[0-3]):[0-5]\d$/)
    .required(),
  reasonForVisit: Joi.string().allow('').default(''),
  patientId: Joi.string().optional(),
});

const cancelAppointment = Joi.object({
  reason: Joi.string().allow('').default(''),
});

const updateStatus = Joi.object({
  status: Joi.string().valid('completed', 'no-show').required(),
});

module.exports = { getSlots, bookAppointment, cancelAppointment, updateStatus };