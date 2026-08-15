const request = require('supertest');
const app = require('../src/app');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('./setup/testDb');
const { createTestTenant, createTestUser } = require('./helpers/factories');

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe('POST /api/v1/auth/login', () => {
  it('logs in a hospital admin with correct credentials and tenant slug', async () => {
    const tenant = await createTestTenant();
    await createTestUser({ tenantId: tenant._id, role: 'admin', email: 'admin@test.dev' });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.dev', password: 'Password123', tenantSlug: tenant.slug });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.user.role).toBe('admin');
  });

  it('rejects a correct email with the wrong password', async () => {
    const tenant = await createTestTenant();
    await createTestUser({ tenantId: tenant._id, role: 'admin', email: 'admin@test.dev' });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.dev', password: 'WrongPassword1', tenantSlug: tenant.slug });

    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });

  it('rejects login against the wrong hospital, even with correct credentials for a different one', async () => {
    const tenantA = await createTestTenant({ name: 'Hospital A' });
    const tenantB = await createTestTenant({ name: 'Hospital B' });
    await createTestUser({ tenantId: tenantA._id, role: 'admin', email: 'admin@test.dev' });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.dev', password: 'Password123', tenantSlug: tenantB.slug });

    expect(res.status).toBe(401);
  });

  it('rejects login for a deactivated hospital', async () => {
    const tenant = await createTestTenant({ isActive: false });
    await createTestUser({ tenantId: tenant._id, role: 'admin', email: 'admin@test.dev' });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'admin@test.dev', password: 'Password123', tenantSlug: tenant.slug });

    expect(res.status).toBe(404); // "Hospital not found or inactive"
  });

  it('logs in super-admin without a tenantSlug', async () => {
    await createTestUser({ role: 'super-admin', email: 'super@test.dev' });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'super@test.dev', password: 'Password123' });

    expect(res.status).toBe(200);
    expect(res.body.data.user.role).toBe('super-admin');
    expect(res.body.data.user.tenantId).toBeNull();
  });

  it('rejects a request missing required fields with a 400, not a 500', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({ email: 'no-password@test.dev' });
    expect(res.status).toBe(400);
    expect(res.body.details).toBeDefined();
  });
  it('writes an audit log entry for a super-admin login without a tenantId', async () => {
  await createTestUser({ role: 'super-admin', email: 'super2@test.dev' });

  await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'super2@test.dev', password: 'Password123' });

  const AuditLog = require('../src/modules/audit/auditLog.model');
  const entry = await AuditLog.findOne({ action: 'LOGIN' }).setOptions({ skipTenantScope: true });

  expect(entry).not.toBeNull();
  expect(entry.tenantId).toBeNull();
});
});

describe('GET /api/v1/auth/me', () => {
  it('rejects requests with no token', async () => {
    const res = await request(app).get('/api/v1/auth/me');
    expect(res.status).toBe(401);
  });

  it('rejects requests with a malformed token', async () => {
    const res = await request(app).get('/api/v1/auth/me').set('Authorization', 'Bearer not-a-real-token');
    expect(res.status).toBe(401);
  });
});