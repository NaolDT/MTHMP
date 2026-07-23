const patientService = require('./patient.service');
const asyncHandler = require('../../shared/utils/asyncHandler');
const { success } = require('../../shared/utils/apiResponse');

const register = asyncHandler(async (req, res) => {
  const result = await patientService.registerPatient(req.tenantId, req.body, req);
  success(res, 201, result);
});

const list = asyncHandler(async (req, res) => {
  const patients = await patientService.listPatients(req.tenantId, req.query);
  success(res, 200, patients);
});

const getOne = asyncHandler(async (req, res) => {
  const patient = await patientService.getPatient(req.tenantId, req.params.id, req.user);
  success(res, 200, patient);
});

const update = asyncHandler(async (req, res) => {
  const patient = await patientService.updatePatient(req.tenantId, req.params.id, req.body, req.user, req);
  success(res, 200, patient);
});

module.exports = { register, list, getOne, update };