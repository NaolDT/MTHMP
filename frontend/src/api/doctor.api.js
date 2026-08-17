import { apiClient } from './client';

export async function fetchDoctors(params = {}) {
  const { data } = await apiClient.get('/doctors', { params });
  return data.data;
}

export async function createDoctor(payload) {
  const { data } = await apiClient.post('/doctors', payload);
  return data.data;
}

export async function updateDoctor(id, payload) {
  const { data } = await apiClient.patch(`/doctors/${id}`, payload);
  return data.data;
}

export async function setDoctorActive(id, isActive) {
  const { data } = await apiClient.patch(`/doctors/${id}/status`, { isActive });
  return data.data;
}

export async function setDoctorAvailability(id, availability) {
  const { data } = await apiClient.put(`/doctors/${id}/availability`, { availability });
  return data.data;
}

export async function fetchMyDoctorProfile() {
  const { data } = await apiClient.get('/doctors/me');
  return data.data;
}

export async function updateMyDoctorProfile(payload) {
  const { data } = await apiClient.patch('/doctors/me', payload);
  return data.data;
}