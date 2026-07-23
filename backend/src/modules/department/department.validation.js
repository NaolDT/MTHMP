const Joi = require('joi');

const createDepartment = Joi.object({
  name: Joi.string().min(2).required(),
  description: Joi.string().allow('').default(''),
});

const updateDepartment = Joi.object({
  name: Joi.string().min(2),
  description: Joi.string().allow(''),
  headDoctorId: Joi.string().allow(null),
}).min(1);

const setActive = Joi.object({
  isActive: Joi.boolean().required(),
});

module.exports = { createDepartment, updateDepartment, setActive };