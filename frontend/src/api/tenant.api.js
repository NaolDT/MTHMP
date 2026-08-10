import { apiClient } from './client';

export async function fetchTenants(params = {}) {
  const { data } = await apiClient.get('/tenants', { params });
  return data.data;
}

export async function createTenant(payload) {
  const { data } = await apiClient.post('/tenants', payload);
  return data.data;
}

export async function setTenantActive(id, isActive) {
  const { data } = await apiClient.patch(`/tenants/${id}/status`, { isActive });
  return data.data;
}