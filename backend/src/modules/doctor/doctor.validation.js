const Joi = require('joi');

const timeRule = Joi.string().pattern(/^([01]\d|2[0-3]):[0-5]\d$/);

const createDoctor = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  phone: Joi.string().allow(''),
  departmentId: Joi.string().required(),
  specialization: Joi.string().required(),
  qualifications: Joi.array().items(Joi.string()).default([]),
  experience: Joi.number().min(0).default(0),
  consultationDuration: Joi.number().min(5).default(30),
});

const updateDoctor = Joi.object({
  departmentId: Joi.string(),
  specialization: Joi.string(),
  qualifications: Joi.array().items(Joi.string()),
  experience: Joi.number().min(0),
  consultationDuration: Joi.number().min(5),
}).min(1);

const setActive = Joi.object({
  isActive: Joi.boolean().required(),
});

const setAvailability = Joi.object({
  availability: Joi.array()
    .items(
      Joi.object({
        day: Joi.string()
          .valid('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday')
          .required(),
        startTime: timeRule.required(),
        endTime: timeRule.required(),
        isAvailable: Joi.boolean().default(true),
      })
    )
    .required(),
});

const updateMyProfile = Joi.object({
  bio: Joi.string().allow('').max(1000),
  photoUrl: Joi.string().allow(''),
  education: Joi.array().items(
    Joi.object({
      degree: Joi.string().required(),
      institution: Joi.string().required(),
      year: Joi.number().integer().min(1950).max(new Date().getFullYear()).allow(null),
    })
  ),
  certifications: Joi.array().items(Joi.string()),
  languages: Joi.array().items(Joi.string()),
}).min(1);

module.exports = { createDoctor, updateDoctor, setActive, setAvailability, updateMyProfile };