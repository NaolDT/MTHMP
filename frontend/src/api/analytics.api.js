import { apiClient } from './client';

export async function fetchTenantOverview() {
  const { data } = await apiClient.get('/analytics/overview');
  return data.data;
}

export async function fetchAppointmentsTrend(days = 7) {
  const { data } = await apiClient.get('/analytics/trend', { params: { days } });
  return data.data;
}

export async function fetchDoctorUtilization(dateFrom, dateTo) {
  const { data } = await apiClient.get('/analytics/utilization', { params: { dateFrom, dateTo } });
  return data.data;
}
export async function fetchPlatformOverview() {
  const { data } = await apiClient.get('/analytics/platform-overview');
  return data.data;
}