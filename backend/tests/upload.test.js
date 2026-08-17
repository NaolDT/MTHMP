const request = require('supertest');
const path = require('path');
const fs = require('fs');

jest.mock('../src/config/cloudinary', () => ({
  uploader: {
    upload_stream: jest.fn((options, callback) => {
      const { Writable } = require('stream');
      const stream = new Writable({
        write(chunk, encoding, cb) {
          cb(); 
        },
      });
      stream.on('finish', () => {
        callback(null, { secure_url: 'https://res.cloudinary.com/test/image/upload/mock.jpg', public_id: 'mock-id' });
      });
      return stream;
    }),
  },
}));

const app = require('../src/app');
const { connectTestDb, clearTestDb, disconnectTestDb } = require('./setup/testDb');
const { createTestTenant, createTestUser, signTestAccessToken } = require('./helpers/factories');

const TEST_IMAGE_PATH = path.join(__dirname, 'fixtures', 'test-image.png');

beforeAll(async () => {
  await connectTestDb();

  const fixturesDir = path.join(__dirname, 'fixtures');
  if (!fs.existsSync(fixturesDir)) fs.mkdirSync(fixturesDir);
  if (!fs.existsSync(TEST_IMAGE_PATH)) {
    const onePixelPng = Buffer.from(
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
      'base64'
    );
    fs.writeFileSync(TEST_IMAGE_PATH, onePixelPng);
  }
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe('POST /api/v1/upload/image', () => {
  it('uploads an image for an admin and returns a URL', async () => {
    const tenant = await createTestTenant();
    const admin = await createTestUser({ tenantId: tenant._id, role: 'admin' });
    const token = signTestAccessToken(admin);

    const res = await request(app)
      .post('/api/v1/upload/image')
      .set('Authorization', `Bearer ${token}`)
      .field('category', 'hospital-logo')
      .attach('image', TEST_IMAGE_PATH);

    expect(res.status).toBe(201);
    expect(res.body.data.url).toMatch(/^https:\/\/res\.cloudinary\.com/);
  });

  it('rejects an invalid category', async () => {
    const tenant = await createTestTenant();
    const admin = await createTestUser({ tenantId: tenant._id, role: 'admin' });
    const token = signTestAccessToken(admin);

    const res = await request(app)
      .post('/api/v1/upload/image')
      .set('Authorization', `Bearer ${token}`)
      .field('category', 'not-a-real-category')
      .attach('image', TEST_IMAGE_PATH);

    expect(res.status).toBe(400);
  });

  it('rejects requests with no file attached', async () => {
    const tenant = await createTestTenant();
    const admin = await createTestUser({ tenantId: tenant._id, role: 'admin' });
    const token = signTestAccessToken(admin);

    const res = await request(app)
      .post('/api/v1/upload/image')
      .set('Authorization', `Bearer ${token}`)
      .field('category', 'hospital-logo');

    expect(res.status).toBe(400);
  });

  it('rejects patients and receptionists from uploading', async () => {
    const tenant = await createTestTenant();
    const patient = await createTestUser({ tenantId: tenant._id, role: 'patient' });
    const token = signTestAccessToken(patient);

    const res = await request(app)
      .post('/api/v1/upload/image')
      .set('Authorization', `Bearer ${token}`)
      .field('category', 'hospital-logo')
      .attach('image', TEST_IMAGE_PATH);

    expect(res.status).toBe(403);
  });
});