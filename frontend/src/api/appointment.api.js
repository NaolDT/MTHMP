import { apiClient } from './client';

export async function fetchSlots(doctorId, date) {
  const { data } = await apiClient.get('/appointments/slots', { params: { doctorId, date } });
  return data.data;
}

export async function bookAppointment(payload) {
  const { data } = await apiClient.post('/appointments', payload);
  return data.data;
}

export async function fetchAppointments(params = {}) {
  const { data } = await apiClient.get('/appointments', { params });
  return data.data;
}

export async function cancelAppointment(id, reason) {
  const { data } = await apiClient.patch(`/appointments/${id}/cancel`, { reason });
  return data.data;
}

export async function updateAppointmentStatus(id, status) {
  const { data } = await apiClient.patch(`/appointments/${id}/status`, { status });
  return data.data;
}