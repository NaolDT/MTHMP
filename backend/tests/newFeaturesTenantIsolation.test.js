const { connectTestDb, clearTestDb, disconnectTestDb } = require('./setup/testDb');
const { createTestTenant, createTestDepartment, createTestHospitalProfile } = require('./helpers/factories');
const HospitalProfile = require('../src/modules/hospitalProfile/hospitalProfile.model');
const Department = require('../src/modules/department/department.model');

beforeAll(async () => {
  await connectTestDb();
});

afterEach(async () => {
  await clearTestDb();
});

afterAll(async () => {
  await disconnectTestDb();
});

describe('HospitalProfile tenant isolation', () => {
  it('a query scoped to tenant A never returns tenant B\'s profile', async () => {
    const tenantA = await createTestTenant({ name: 'Hospital A' });
    const tenantB = await createTestTenant({ name: 'Hospital B' });
    await createTestHospitalProfile(tenantA._id, { tagline: 'Tagline A' });
    await createTestHospitalProfile(tenantB._id, { tagline: 'Tagline B' });

    const resultsForA = await HospitalProfile.find({}).setOptions({ tenantId: tenantA._id });

    expect(resultsForA).toHaveLength(1);
    expect(resultsForA[0].tagline).toBe('Tagline A');
  });

  it('refuses an unscoped query, same as every other tenant-scoped model', async () => {
    const tenant = await createTestTenant();
    await createTestHospitalProfile(tenant._id);

    await expect(HospitalProfile.find({})).rejects.toThrow(/without a tenantId/);
  });

  it('the unique tenantId index actually prevents a second profile per tenant', async () => {
    const tenant = await createTestTenant();
    await createTestHospitalProfile(tenant._id);

    await expect(createTestHospitalProfile(tenant._id)).rejects.toThrow();
  });
});

describe('Department services[] embedded field respects tenant isolation', () => {
  it('services on tenant A departments never leak into tenant B queries', async () => {
    const tenantA = await createTestTenant({ name: 'Hospital A' });
    const tenantB = await createTestTenant({ name: 'Hospital B' });
    await createTestDepartment(tenantA._id, { services: [{ name: 'Cardiac Surgery' }] });
    await createTestDepartment(tenantB._id, { services: [{ name: 'Pediatric Care' }] });

    const resultsForA = await Department.find({}).setOptions({ tenantId: tenantA._id });

    expect(resultsForA).toHaveLength(1);
    expect(resultsForA[0].services[0].name).toBe('Cardiac Surgery');
  });
});