const { connectTestDb, clearTestDb, disconnectTestDb } = require('./setup/testDb');
const { createTestTenant, createTestDepartment } = require('./helpers/factories');
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

describe('tenant isolation plugin', () => {
  it('a query scoped to tenant A never returns tenant B\'s data', async () => {
    const tenantA = await createTestTenant({ name: 'Hospital A' });
    const tenantB = await createTestTenant({ name: 'Hospital B' });

    await createTestDepartment(tenantA._id, { name: 'Cardiology' });
    await createTestDepartment(tenantB._id, { name: 'Pediatrics' });

    const resultsForA = await Department.find({}).setOptions({ tenantId: tenantA._id });

    expect(resultsForA).toHaveLength(1);
    expect(resultsForA[0].name).toBe('Cardiology');
  });

  it('refuses to run a tenant-scoped query with no tenant context at all', async () => {
    const tenant = await createTestTenant();
    await createTestDepartment(tenant._id);

    await expect(Department.find({})).rejects.toThrow(/without a tenantId/);
  });

  it('allows an explicit platform-level query via skipTenantScope', async () => {
    const tenantA = await createTestTenant({ name: 'Hospital A' });
    const tenantB = await createTestTenant({ name: 'Hospital B' });
    await createTestDepartment(tenantA._id);
    await createTestDepartment(tenantB._id);

    const all = await Department.find({}).setOptions({ skipTenantScope: true });
    expect(all).toHaveLength(2);
  });

  it('cannot save a tenant-scoped document without a tenantId', async () => {
    await expect(Department.create({ name: 'No Tenant Department' })).rejects.toThrow();
  });

  it('a findOneAndUpdate without tenant context is also blocked', async () => {
    const tenant = await createTestTenant();
    const dept = await createTestDepartment(tenant._id);

    await expect(
      Department.findOneAndUpdate({ _id: dept._id }, { name: 'Hacked Name' })
    ).rejects.toThrow(/without a tenantId/);
  });
});