const request = require('supertest');

jest.mock('../src/modules/notification/notification.service', () => ({
  sendMail: jest.fn(),
  sendAppointmentBooked: jest.fn(),
  sendAppointmentCancelled: jest.fn(),
  sendPasswordReset: jest.fn(),
}));

const app = require('../src/app');
const notificationService = require('../src/modules/notification/notification.service');
const User = require('../src/modules/user/user.model');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('./setup/testDb');
const { createTestTenant, createTestUser } = require('./helpers/factories');

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
  jest.clearAllMocks();
});

afterAll(async () => {
  await disconnectTestDb();
});

function extractTokenFromLastEmail() {
  const call = notificationService.sendPasswordReset.mock.calls[0][0];
  const url = new URL(call.resetUrl);
  return url.searchParams.get('token');
}

describe('POST /api/v1/auth/forgot-password', () => {
  it('sends a reset email and stores a hashed token for an existing user', async () => {
    const tenant = await createTestTenant();
    await createTestUser({ tenantId: tenant._id, role: 'admin', email: 'admin@test.dev' });

    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'admin@test.dev', tenantSlug: tenant.slug });

    expect(res.status).toBe(200);
    expect(notificationService.sendPasswordReset).toHaveBeenCalledTimes(1);

    const user = await User.findOne({ email: 'admin@test.dev' })
      .select('+resetPasswordToken +resetPasswordExpires')
      .setOptions({ skipTenantScope: true });

    expect(user.resetPasswordToken).toBeTruthy();
    expect(user.resetPasswordExpires.getTime()).toBeGreaterThan(Date.now());
  });

  it('returns the same generic response for an email that does not exist (enumeration protection)', async () => {
    const tenant = await createTestTenant();

    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'nobody@test.dev', tenantSlug: tenant.slug });

    expect(res.status).toBe(200);
    expect(res.body.data.message).toMatch(/if an account exists/i);
    expect(notificationService.sendPasswordReset).not.toHaveBeenCalled();
  });

  it('returns 200 for an inactive user without sending an email', async () => {
    const tenant = await createTestTenant();
    await createTestUser({ tenantId: tenant._id, role: 'admin', email: 'inactive@test.dev', isActive: false });

    const res = await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'inactive@test.dev', tenantSlug: tenant.slug });

    expect(res.status).toBe(200);
    expect(notificationService.sendPasswordReset).not.toHaveBeenCalled();
  });
});

describe('POST /api/v1/auth/reset-password', () => {
  it('resets the password with a valid token and revokes existing sessions', async () => {
  const tenant = await createTestTenant();
  await createTestUser({ tenantId: tenant._id, role: 'admin', email: 'admin@test.dev' });

  const loginRes = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@test.dev', password: 'Password123', tenantSlug: tenant.slug });
  const oldRefreshToken = loginRes.body.data.refreshToken;

  await request(app)
    .post('/api/v1/auth/forgot-password')
    .send({ email: 'admin@test.dev', tenantSlug: tenant.slug });
  const token = extractTokenFromLastEmail();

  const resetRes = await request(app)
    .post('/api/v1/auth/reset-password')
    .send({ token, password: 'NewPassword456' });
  expect(resetRes.status).toBe(200);

  
  const refreshAttempt = await request(app)
    .post('/api/v1/auth/refresh')
    .send({ refreshToken: oldRefreshToken });
  expect(refreshAttempt.status).toBe(401);

  const oldPasswordLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@test.dev', password: 'Password123', tenantSlug: tenant.slug });
  expect(oldPasswordLogin.status).toBe(401);

  const newPasswordLogin = await request(app)
    .post('/api/v1/auth/login')
    .send({ email: 'admin@test.dev', password: 'NewPassword456', tenantSlug: tenant.slug });
  expect(newPasswordLogin.status).toBe(200);
});

  it('rejects an invalid token', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ token: 'not-a-real-token', password: 'NewPassword456' });

    expect(res.status).toBe(400);
expect(res.body.message).toMatch(/invalid or has expired/i);  });

  it('rejects an expired token', async () => {
    const tenant = await createTestTenant();
    await createTestUser({ tenantId: tenant._id, role: 'admin', email: 'admin@test.dev' });

    await request(app)
      .post('/api/v1/auth/forgot-password')
      .send({ email: 'admin@test.dev', tenantSlug: tenant.slug });
    const token = extractTokenFromLastEmail();

    await User.findOneAndUpdate(
      { email: 'admin@test.dev' },
      { resetPasswordExpires: new Date(Date.now() - 60 * 1000) }
    ).setOptions({ skipTenantScope: true });

    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ token, password: 'NewPassword456' });

    expect(res.status).toBe(400);
  });

  it('rejects a weak new password with a 400 and validation details', async () => {
    const res = await request(app)
      .post('/api/v1/auth/reset-password')
      .send({ token: 'irrelevant-here', password: 'weak' });

    expect(res.status).toBe(400);
    expect(res.body.details).toBeDefined();
  });
});