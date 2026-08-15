const request = require('supertest');
const app = require('../src/app');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('./setup/testDb');
const {
  createTestTenant,
  createTestUser,
  signTestAccessToken,
  createTestDepartment,
  createTestDoctor,
  createTestPatient,
  createTestAppointment,
} = require('./helpers/factories');

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

async function setupTenantWithDoctorAndPatient() {
  const tenant = await createTestTenant();
  const department = await createTestDepartment(tenant._id);
  const { doctor } = await createTestDoctor(tenant._id, department._id);
  const { user: patientUser, patient } = await createTestPatient(tenant._id);
  const patientToken = signTestAccessToken(patientUser);
  return { tenant, department, doctor, patient, patientUser, patientToken };
}

describe('GET /api/v1/appointments/slots', () => {
  it('generates 30-minute slots across the doctor\'s Monday availability window', async () => {
    const { doctor, patientToken } = await setupTenantWithDoctorAndPatient();

    const res = await request(app)
      .get('/api/v1/appointments/slots')
      .query({ doctorId: doctor._id.toString(), date: '2026-09-07' }) // a Monday
      .set('Authorization', `Bearer ${patientToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(8);
    expect(res.body.data[0]).toMatchObject({ startTime: '09:00', endTime: '09:30', available: true });
    expect(res.body.data[7]).toMatchObject({ startTime: '12:30', endTime: '13:00', available: true });
  });

  it('returns no slots for a day the doctor has no availability set', async () => {
    const { doctor, patientToken } = await setupTenantWithDoctorAndPatient();

    const res = await request(app)
      .get('/api/v1/appointments/slots')
      .query({ doctorId: doctor._id.toString(), date: '2026-09-08' }) // Tuesday — no availability
      .set('Authorization', `Bearer ${patientToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  it('marks an already-booked slot as unavailable, without removing it from the list', async () => {
    const { tenant, department, doctor, patient, patientUser, patientToken } = await setupTenantWithDoctorAndPatient();
    await createTestAppointment(tenant._id, {
      doctorId: doctor._id,
      patientId: patient._id,
      departmentId: department._id,
      bookedBy: patientUser._id,
      startTime: '09:00',
      endTime: '09:30',
    });

    const res = await request(app)
      .get('/api/v1/appointments/slots')
      .query({ doctorId: doctor._id.toString(), date: '2026-09-07' })
      .set('Authorization', `Bearer ${patientToken}`);

    const bookedSlot = res.body.data.find((s) => s.startTime === '09:00');
    const openSlot = res.body.data.find((s) => s.startTime === '09:30');

    expect(bookedSlot.available).toBe(false);
    expect(openSlot.available).toBe(true);
  });
});

describe('POST /api/v1/appointments — booking', () => {
  it('a patient can book an open slot', async () => {
    const { doctor, patientToken } = await setupTenantWithDoctorAndPatient();

    const res = await request(app)
      .post('/api/v1/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ doctorId: doctor._id.toString(), date: '2026-09-07', startTime: '09:00', reasonForVisit: 'Checkup' });

    expect(res.status).toBe(201);
    expect(res.body.data.status).toBe('booked');
    expect(res.body.data.startTime).toBe('09:00');
  });

  it('rejects double-booking the same doctor/slot with a 409, not a 500', async () => {
    const { tenant, department, doctor, patient, patientUser, patientToken } = await setupTenantWithDoctorAndPatient();
    await createTestAppointment(tenant._id, {
      doctorId: doctor._id,
      patientId: patient._id,
      departmentId: department._id,
      bookedBy: patientUser._id,
    });

    const res = await request(app)
      .post('/api/v1/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ doctorId: doctor._id.toString(), date: '2026-09-07', startTime: '09:00' });

    expect(res.status).toBe(409);
  });

  it('rejects booking outside the doctor\'s availability window', async () => {
    const { doctor, patientToken } = await setupTenantWithDoctorAndPatient();

    const res = await request(app)
      .post('/api/v1/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ doctorId: doctor._id.toString(), date: '2026-09-07', startTime: '18:00' }); // outside 09:00-13:00

    expect(res.status).toBe(400);
  });

  it('rejects booking a time in the past', async () => {
    const { doctor, patientToken } = await setupTenantWithDoctorAndPatient();

    const res = await request(app)
      .post('/api/v1/appointments')
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ doctorId: doctor._id.toString(), date: '2020-01-06', startTime: '09:00' }); // a Monday, but in the past

    expect(res.status).toBe(400);
  });
});

describe('PATCH /api/v1/appointments/:id/cancel — BR-004', () => {
  it('a patient can cancel an appointment more than 24 hours away', async () => {
    const { tenant, department, doctor, patient, patientUser, patientToken } = await setupTenantWithDoctorAndPatient();
    const farFutureDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // 10 days out
    farFutureDate.setUTCHours(0, 0, 0, 0);

    const appointment = await createTestAppointment(tenant._id, {
      doctorId: doctor._id,
      patientId: patient._id,
      departmentId: department._id,
      bookedBy: patientUser._id,
      date: farFutureDate,
    });

    const res = await request(app)
      .patch(`/api/v1/appointments/${appointment._id}/cancel`)
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ reason: 'Change of plans' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('cancelled');
    expect(res.body.data.cancellation.overridden).toBe(false);
  });

  it('a patient CANNOT cancel within 24 hours — no exceptions', async () => {
    const { tenant, department, doctor, patient, patientUser, patientToken } = await setupTenantWithDoctorAndPatient();
    const soonDate = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours from now
    const appointment = await createTestAppointment(tenant._id, {
      doctorId: doctor._id,
      patientId: patient._id,
      departmentId: department._id,
      bookedBy: patientUser._id,
      date: new Date(soonDate.toISOString().slice(0, 10)),
      startTime: `${soonDate.getUTCHours().toString().padStart(2, '0')}:00`,
    });

    const res = await request(app)
      .patch(`/api/v1/appointments/${appointment._id}/cancel`)
      .set('Authorization', `Bearer ${patientToken}`)
      .send({ reason: 'Change of plans' });

    expect(res.status).toBe(400);
  });

  it('staff CAN cancel within 24 hours, but only with a reason (BR-004 override)', async () => {
    const { tenant, department, doctor, patient, patientUser } = await setupTenantWithDoctorAndPatient();
const adminUser = await createTestUser({ tenantId: tenant._id, role: 'admin' });
    const adminToken = signTestAccessToken(adminUser);

    const soonDate = new Date(Date.now() + 2 * 60 * 60 * 1000);
    const appointment = await createTestAppointment(tenant._id, {
      doctorId: doctor._id,
      patientId: patient._id,
      departmentId: department._id,
      bookedBy: patientUser._id,
      date: new Date(soonDate.toISOString().slice(0, 10)),
      startTime: `${soonDate.getUTCHours().toString().padStart(2, '0')}:00`,
    });

    const withoutReason = await request(app)
      .patch(`/api/v1/appointments/${appointment._id}/cancel`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: '' });
    expect(withoutReason.status).toBe(400);

    const withReason = await request(app)
      .patch(`/api/v1/appointments/${appointment._id}/cancel`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ reason: 'Doctor emergency' });
    expect(withReason.status).toBe(200);
    expect(withReason.body.data.cancellation.overridden).toBe(true);
  });
});

describe('BR-005 — doctor daily availability cap', () => {
  it('rejects availability exceeding 8 hours in one day', async () => {
    const { tenant, department } = await setupTenantWithDoctorAndPatient().then(async (ctx) => ctx);
const adminUser = await createTestUser({ tenantId: tenant._id, role: 'admin' });
    const adminToken = signTestAccessToken(adminUser);
    const { doctor } = await createTestDoctor(tenant._id, department._id);

    const res = await request(app)
      .put(`/api/v1/doctors/${doctor._id}/availability`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ availability: [{ day: 'tuesday', startTime: '07:00', endTime: '16:00' }] }); // 9 hours

    expect(res.status).toBe(400);
    expect(res.body.message).toMatch(/8-hour/);
  });

  it('accepts availability at or under the 8-hour cap', async () => {
    const { tenant, department } = await setupTenantWithDoctorAndPatient().then(async (ctx) => ctx);
const adminUser = await createTestUser({ tenantId: tenant._id, role: 'admin' });
    const adminToken = signTestAccessToken(adminUser);
    const { doctor } = await createTestDoctor(tenant._id, department._id);

    const res = await request(app)
      .put(`/api/v1/doctors/${doctor._id}/availability`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ availability: [{ day: 'tuesday', startTime: '08:00', endTime: '16:00' }] }); // exactly 8 hours

    expect(res.status).toBe(200);
  });
});