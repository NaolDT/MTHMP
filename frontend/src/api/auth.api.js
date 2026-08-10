import { apiClient } from './client';

export async function loginRequest({ email, password, tenantSlug }) {
  const { data } = await apiClient.post('/auth/login', { email, password, tenantSlug });
  return data.data; // { user, accessToken, refreshToken }
}

export async function logoutRequest() {
  await apiClient.post('/auth/logout');
}

export async function meRequest() {
  const { data } = await apiClient.get('/auth/me');
  return data.data;
}

export async function registerPatientRequest(payload) {
  const { data } = await apiClient.post('/auth/register/patient', payload);
  return data.data;
}