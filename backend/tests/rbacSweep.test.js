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

describe('RBAC sweep — non-super-admin roles rejected from platform-level routes', () => {
  const platformRoutes = [
    { method: 'get', path: '/api/v1/tenants' },
    { method: 'get', path: '/api/v1/hospital-profile/pending' },
    { method: 'get', path: '/api/v1/analytics/platform-overview' },
    { method: 'get', path: '/api/v1/contact' },
  ];

  it.each(platformRoutes)('rejects a hospital admin from $method $path', async ({ method, path }) => {
    const tenant = await createTestTenant();
    const admin = await createTestUser({ tenantId: tenant._id, role: 'admin' });
    const token = signTestAccessToken(admin);

    const res = await request(app)[method](path).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  it.each(platformRoutes)('rejects a patient from $method $path', async ({ method, path }) => {
    const tenant = await createTestTenant();
    const patient = await createTestUser({ tenantId: tenant._id, role: 'patient' });
    const token = signTestAccessToken(patient);

    const res = await request(app)[method](path).set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});

describe('RBAC sweep — every protected route rejects unauthenticated requests', () => {
  const protectedRoutes = [
    '/api/v1/tenants',
    '/api/v1/departments',
    '/api/v1/doctors',
    '/api/v1/patients',
    '/api/v1/appointments',
    '/api/v1/hospital-profile',
    '/api/v1/doctors/me',
    '/api/v1/staff',
  ];

  it.each(protectedRoutes)('rejects a request with no token to %s', async (path) => {
    const res = await request(app).get(path);
    expect(res.status).toBe(401);
  });
});