const request = require('supertest');
const app = require('../src/app');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('./setup/testDb');
const {
  createTestTenant,
  createTestUser,
  signTestAccessToken,
  createTestDepartment,
  createTestDoctor,
  createTestHospitalProfile,
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

describe('GET /api/v1/hospital-profile/public/:slug', () => {
  it('returns a published profile', async () => {
    const tenant = await createTestTenant({ name: 'Bethel Hospital' });
    await createTestHospitalProfile(tenant._id, { status: 'published', tagline: 'Care you can trust' });

    const res = await request(app).get(`/api/v1/hospital-profile/public/${tenant.slug}`);

    expect(res.status).toBe(200);
    expect(res.body.data.tenant.name).toBe('Bethel Hospital');
    expect(res.body.data.profile.tagline).toBe('Care you can trust');
  });

  it('returns 404 for a draft profile — never leaked publicly', async () => {
    const tenant = await createTestTenant();
    await createTestHospitalProfile(tenant._id, { status: 'draft' });

    const res = await request(app).get(`/api/v1/hospital-profile/public/${tenant.slug}`);
    expect(res.status).toBe(404);
  });

  it('returns 404 for a pending profile — never leaked publicly', async () => {
    const tenant = await createTestTenant();
    await createTestHospitalProfile(tenant._id, { status: 'pending' });

    const res = await request(app).get(`/api/v1/hospital-profile/public/${tenant.slug}`);
    expect(res.status).toBe(404);
  });

  it('returns 404 for a suspended hospital even if its profile is published', async () => {
    const tenant = await createTestTenant({ isActive: false });
    await createTestHospitalProfile(tenant._id, { status: 'published' });

    const res = await request(app).get(`/api/v1/hospital-profile/public/${tenant.slug}`);
    expect(res.status).toBe(404);
  });

  it('returns 404 for a slug that does not exist', async () => {
    const res = await request(app).get('/api/v1/hospital-profile/public/not-a-real-hospital');
    expect(res.status).toBe(404);
  });
});

describe('GET /api/v1/departments/public/:slug', () => {
  it('returns only active departments', async () => {
    const tenant = await createTestTenant();
    await createTestDepartment(tenant._id, { name: 'Cardiology', isActive: true });
    await createTestDepartment(tenant._id, { name: 'Discontinued Ward', isActive: false });

    const res = await request(app).get(`/api/v1/departments/public/${tenant.slug}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe('Cardiology');
  });

  it('never returns another hospital\'s departments', async () => {
    const tenantA = await createTestTenant({ name: 'Hospital A' });
    const tenantB = await createTestTenant({ name: 'Hospital B' });
    await createTestDepartment(tenantA._id, { name: 'A Dept' });
    await createTestDepartment(tenantB._id, { name: 'B Dept' });

    const res = await request(app).get(`/api/v1/departments/public/${tenantA.slug}`);

    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].name).toBe('A Dept');
  });
});

describe('GET /api/v1/doctors/public/:slug', () => {
  it('returns only active doctors with patient-facing fields, no sensitive data', async () => {
    const tenant = await createTestTenant();
    const department = await createTestDepartment(tenant._id);
    await createTestDoctor(tenant._id, department._id, {}, { isActive: true, bio: 'Caring physician' });
    await createTestDoctor(tenant._id, department._id, { email: 'inactive@test.dev' }, { isActive: false });

    const res = await request(app).get(`/api/v1/doctors/public/${tenant.slug}`);

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].bio).toBe('Caring physician');
    expect(res.body.data[0].userId.email).toBeUndefined(); // email never exposed publicly
  });

  it('filters by department when provided', async () => {
    const tenant = await createTestTenant();
    const deptA = await createTestDepartment(tenant._id, { name: 'Cardiology' });
    const deptB = await createTestDepartment(tenant._id, { name: 'Pediatrics' });
    await createTestDoctor(tenant._id, deptA._id, { email: 'a@test.dev' });
    await createTestDoctor(tenant._id, deptB._id, { email: 'b@test.dev' });

    const res = await request(app).get(`/api/v1/doctors/public/${tenant.slug}`).query({ departmentId: deptA._id.toString() });

    expect(res.body.data).toHaveLength(1);
  });
});