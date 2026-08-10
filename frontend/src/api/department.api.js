import { apiClient } from './client';

export async function fetchDepartments(params = {}) {
  const { data } = await apiClient.get('/departments', { params });
  return data.data;
}

export async function createDepartment(payload) {
  const { data } = await apiClient.post('/departments', payload);
  return data.data;
}

export async function updateDepartment(id, payload) {
  const { data } = await apiClient.patch(`/departments/${id}`, payload);
  return data.data;
}

export async function setDepartmentActive(id, isActive) {
  const { data } = await apiClient.patch(`/departments/${id}/status`, { isActive });
  return data.data;
}