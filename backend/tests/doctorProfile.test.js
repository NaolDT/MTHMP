const request = require('supertest');
const app = require('../src/app');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('./setup/testDb');
const { createTestTenant, createTestDepartment, createTestDoctor, createTestUser, signTestAccessToken } = require('./helpers/factories');

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe('GET /api/v1/doctors/me', () => {
  it('returns the logged-in doctor\'s own profile', async () => {
    const tenant = await createTestTenant();
    const department = await createTestDepartment(tenant._id);
    const { user } = await createTestDoctor(tenant._id, department._id);
    const token = signTestAccessToken(user);

    const res = await request(app).get('/api/v1/doctors/me').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.userId._id).toBe(user._id.toString());
  });

  it('rejects non-doctor roles', async () => {
    const tenant = await createTestTenant();
    const admin = await createTestUser({ tenantId: tenant._id, role: 'admin' });
    const token = signTestAccessToken(admin);

    const res = await request(app).get('/api/v1/doctors/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});

describe('PATCH /api/v1/doctors/me', () => {
  it('updates bio, education, certifications, and languages', async () => {
    const tenant = await createTestTenant();
    const department = await createTestDepartment(tenant._id);
    const { user } = await createTestDoctor(tenant._id, department._id);
    const token = signTestAccessToken(user);

    const res = await request(app)
      .patch('/api/v1/doctors/me')
      .set('Authorization', `Bearer ${token}`)
      .send({
        bio: 'Board-certified cardiologist with 10 years of experience.',
        education: [{ degree: 'MD', institution: 'Addis Ababa University', year: 2012 }],
        certifications: ['Board Certified Cardiologist'],
        languages: ['English', 'Amharic'],
      });

    expect(res.status).toBe(200);
    expect(res.body.data.bio).toContain('cardiologist');
    expect(res.body.data.education).toHaveLength(1);
    expect(res.body.data.languages).toEqual(['English', 'Amharic']);
  });

  it('preserves existing admin-managed fields untouched', async () => {
    const tenant = await createTestTenant();
    const department = await createTestDepartment(tenant._id);
    const { user, doctor } = await createTestDoctor(tenant._id, department._id, {}, { specialization: 'Cardiology' });
    const token = signTestAccessToken(user);

    await request(app)
      .patch('/api/v1/doctors/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ bio: 'Updated bio only' });

    const res = await request(app).get('/api/v1/doctors/me').set('Authorization', `Bearer ${token}`);
    expect(res.body.data.specialization).toBe('Cardiology'); // unchanged, not overwritten or wiped
  });

  it('rejects an empty update body', async () => {
    const tenant = await createTestTenant();
    const department = await createTestDepartment(tenant._id);
    const { user } = await createTestDoctor(tenant._id, department._id);
    const token = signTestAccessToken(user);

    const res = await request(app).patch('/api/v1/doctors/me').set('Authorization', `Bearer ${token}`).send({});
    expect(res.status).toBe(400);
  });

  it('rejects an invalid education year', async () => {
    const tenant = await createTestTenant();
    const department = await createTestDepartment(tenant._id);
    const { user } = await createTestDoctor(tenant._id, department._id);
    const token = signTestAccessToken(user);

    const res = await request(app)
      .patch('/api/v1/doctors/me')
      .set('Authorization', `Bearer ${token}`)
      .send({ education: [{ degree: 'MD', institution: 'Test University', year: 1800 }] });

    expect(res.status).toBe(400);
  });

  it('a doctor cannot use /me to affect a different doctor in the same tenant', async () => {
    const tenant = await createTestTenant();
    const department = await createTestDepartment(tenant._id);
    const { user: userA } = await createTestDoctor(tenant._id, department._id, { email: 'doctorA@test.dev' });
    const { doctor: doctorB } = await createTestDoctor(tenant._id, department._id, { email: 'doctorB@test.dev' });
    const tokenA = signTestAccessToken(userA);

    await request(app)
      .patch('/api/v1/doctors/me')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ bio: 'This should only affect doctor A' });

    const Doctor = require('../src/modules/doctor/doctor.model');
    const refreshedB = await Doctor.findById(doctorB._id).setOptions({ tenantId: tenant._id });
    expect(refreshedB.bio).toBe('');
  });
});