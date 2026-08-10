import { apiClient } from './client';

export async function fetchPatients(params = {}) {
  const { data } = await apiClient.get('/patients', { params });
  return data.data;
}

export async function registerPatient(payload) {
  const { data } = await apiClient.post('/patients', payload);
  return data.data;
}

export async function fetchPatient(id) {
  const { data } = await apiClient.get(`/patients/${id}`);
  return data.data;
}