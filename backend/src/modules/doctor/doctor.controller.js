const doctorService = require('./doctor.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success } = require('../../shared/utils/apiResponse');

const create = asyncHandler(async (req, res) => {
  const result = await doctorService.createDoctor(req.tenantId, req.body, req);
  success(res, 201, result);
});

const list = asyncHandler(async (req, res) => {
  const doctors = await doctorService.listDoctors(req.tenantId, req.query);
  success(res, 200, doctors);
});

const getOne = asyncHandler(async (req, res) => {
  const doctor = await doctorService.getDoctor(req.tenantId, req.params.id);
  success(res, 200, doctor);
});

const update = asyncHandler(async (req, res) => {
  const doctor = await doctorService.updateDoctor(req.tenantId, req.params.id, req.body, req);
  success(res, 200, doctor);
});

const setActive = asyncHandler(async (req, res) => {
  const doctor = await doctorService.setDoctorActive(req.tenantId, req.params.id, req.body.isActive, req);
  success(res, 200, doctor);
});

const setAvailability = asyncHandler(async (req, res) => {
  const doctor = await doctorService.setAvailability(req.tenantId, req.params.id, req.body.availability, req.user, req);
  success(res, 200, doctor);
});

const getMyProfile = asyncHandler(async (req, res) => {
  const doctor = await doctorService.getMyProfile(req.tenantId, req.user.id);
  success(res, 200, doctor);
});

const updateMyProfile = asyncHandler(async (req, res) => {
  const doctor = await doctorService.updateMyProfile(req.tenantId, req.user.id, req.body);
  success(res, 200, doctor);
});

const listPublic = asyncHandler(async (req, res) => {
  const doctors = await doctorService.listPublicDoctors(req.params.slug, req.query);
  success(res, 200, doctors);
});

module.exports = { create, list, getOne, update, setActive, setAvailability, getMyProfile, updateMyProfile, listPublic };