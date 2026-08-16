const request = require('supertest');
const app = require('../src/app');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('./setup/testDb');
const { createTestTenant, createTestUser, signTestAccessToken } = require('./helpers/factories');

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

async function setupAdmin(tenantOverrides = {}) {
  const tenant = await createTestTenant(tenantOverrides);
  const admin = await createTestUser({ tenantId: tenant._id, role: 'admin' });
  const token = signTestAccessToken(admin);
  return { tenant, admin, token };
}

describe('GET /api/v1/hospital-profile', () => {
  it('auto-creates a draft profile on first access', async () => {
    const { token } = await setupAdmin();

    const res = await request(app).get('/api/v1/hospital-profile').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('draft');
  });

  it('returns the same profile on subsequent calls, not a new one each time', async () => {
    const { token } = await setupAdmin();

    const first = await request(app).get('/api/v1/hospital-profile').set('Authorization', `Bearer ${token}`);
    const second = await request(app).get('/api/v1/hospital-profile').set('Authorization', `Bearer ${token}`);

    expect(first.body.data._id).toBe(second.body.data._id);
  });

  it('rejects non-admin roles', async () => {
    const tenant = await createTestTenant();
    const doctor = await createTestUser({ tenantId: tenant._id, role: 'doctor' });
    const token = signTestAccessToken(doctor);

    const res = await request(app).get('/api/v1/hospital-profile').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it('each tenant gets its own isolated profile', async () => {
    const { token: tokenA } = await setupAdmin({ name: 'Hospital A' });
    const { token: tokenB } = await setupAdmin({ name: 'Hospital B' });

    await request(app)
      .patch('/api/v1/hospital-profile')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ tagline: 'Hospital A tagline' });

    const resB = await request(app).get('/api/v1/hospital-profile').set('Authorization', `Bearer ${tokenB}`);
    expect(resB.body.data.tagline).toBe('');
  });
});

describe('PATCH /api/v1/hospital-profile', () => {
  it('updates fields on the draft profile', async () => {
    const { token } = await setupAdmin();

    const res = await request(app)
      .patch('/api/v1/hospital-profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ tagline: 'Compassionate care, every day.', foundingYear: 1995 });

    expect(res.status).toBe(200);
    expect(res.body.data.tagline).toBe('Compassionate care, every day.');
    expect(res.body.data.foundingYear).toBe(1995);
  });

  it('rejects an empty update body', async () => {
    const { token } = await setupAdmin();

    const res = await request(app).patch('/api/v1/hospital-profile').set('Authorization', `Bearer ${token}`).send({});
    expect(res.status).toBe(400);
  });

  it('reverts status to draft when a published profile is edited', async () => {
    const { tenant, token } = await setupAdmin();
    const HospitalProfile = require('../src/modules/hospitalProfile/hospitalProfile.model');
    await HospitalProfile.findOneAndUpdate({}, { status: 'published', publishedAt: new Date() }).setOptions({
      tenantId: tenant._id,
    });

    const res = await request(app)
      .patch('/api/v1/hospital-profile')
      .set('Authorization', `Bearer ${token}`)
      .send({ tagline: 'Updated after publishing' });

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('draft');
  });
});

describe('POST /api/v1/hospital-profile/submit', () => {
  it('transitions a draft profile to pending', async () => {
    const { token } = await setupAdmin();

    const res = await request(app).post('/api/v1/hospital-profile/submit').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.data.status).toBe('pending');
    expect(res.body.data.submittedAt).not.toBeNull();
  });

  it('rejects submitting a profile that is already pending', async () => {
    const { token } = await setupAdmin();

    await request(app).post('/api/v1/hospital-profile/submit').set('Authorization', `Bearer ${token}`);
    const res = await request(app).post('/api/v1/hospital-profile/submit').set('Authorization', `Bearer ${token}`);

    expect(res.status).toBe(400);
  });
});