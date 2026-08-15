const jwt = require('jsonwebtoken');
const Tenant = require('../../src/modules/tenant/tenant.model');
const User = require('../../src/modules/user/user.model');
const Department = require('../../src/modules/department/department.model');
const Doctor = require('../../src/modules/doctor/doctor.model');
const Patient = require('../../src/modules/patient/patient.model');
const { jwt: jwtConfig } = require('../../src/config/env');

function uniqueSuffix() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function createTestTenant(overrides = {}) {
  return Tenant.create({
    name: 'Test Hospital',
    slug: `test-hospital-${uniqueSuffix()}`,
    ...overrides,
  });
}

async function createTestUser({ tenantId, role = 'patient', ...overrides } = {}) {
  const passwordHash = await User.hashPassword('Password123');
  return User.create({
    tenantId: role === 'super-admin' ? null : tenantId,
    email: overrides.email || `${role}-${uniqueSuffix()}@test.dev`,
    passwordHash,
    role,
    firstName: 'Test',
    lastName: role,
    ...overrides,
  });
}

function signTestAccessToken(user) {
  return jwt.sign(
    { sub: user._id.toString(), tenantId: user.tenantId ? user.tenantId.toString() : null, role: user.role },
    jwtConfig.accessSecret,
    { expiresIn: '15m' }
  );
}

async function createTestDepartment(tenantId, overrides = {}) {
  return Department.create({ tenantId, name: 'Cardiology', ...overrides });
}

async function createTestDoctor(tenantId, departmentId, userOverrides = {}, doctorOverrides = {}) {
  const user = await createTestUser({ tenantId, role: 'doctor', ...userOverrides });
  const doctor = await Doctor.create({
    tenantId,
    userId: user._id,
    departmentId,
    specialization: 'General Medicine',
    consultationDuration: 30,
    availability: [{ day: 'monday', startTime: '09:00', endTime: '13:00' }],
    ...doctorOverrides,
  });
  return { user, doctor };
}

async function createTestPatient(tenantId, userOverrides = {}, patientOverrides = {}) {
  const user = await createTestUser({ tenantId, role: 'patient', ...userOverrides });
  const patient = await Patient.create({
    tenantId,
    userId: user._id,
    phone: '0900000000',
    dateOfBirth: new Date('1990-01-01'),
    ...patientOverrides,
  });
  return { user, patient };
}

module.exports = {
  createTestTenant,
  createTestUser,
  signTestAccessToken,
  createTestDepartment,
  createTestDoctor,
  createTestPatient,
};