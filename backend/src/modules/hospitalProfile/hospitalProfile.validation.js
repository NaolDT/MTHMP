const Joi = require('joi');

const workingHourItem = Joi.object({
  day: Joi.string().valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday').required(),
  openTime: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/),
  closeTime: Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/),
  isOpen: Joi.boolean(),
});

const updateProfile = Joi.object({
  tagline: Joi.string().allow('').max(120),
  shortDescription: Joi.string().allow('').max(300),
  fullDescription: Joi.string().allow(''),
  foundingYear: Joi.number().integer().min(1800).max(new Date().getFullYear()).allow(null),
  history: Joi.string().allow(''),
  mission: Joi.string().allow(''),
  vision: Joi.string().allow(''),
  values: Joi.array().items(Joi.string()),
  facilities: Joi.array().items(Joi.string()),
  workingHours: Joi.array().items(workingHourItem),
  contactAddress: Joi.object({
    street: Joi.string().allow(''),
    city: Joi.string().allow(''),
    region: Joi.string().allow(''),
    country: Joi.string().allow(''),
    phone: Joi.string().allow(''),
    email: Joi.string().email().allow(''),
    emergencyPhone: Joi.string().allow(''),
  }),
}).min(1);

const rejectProfile = Joi.object({
  reason: Joi.string().min(3).required(),
});

module.exports = { updateProfile, rejectProfile };