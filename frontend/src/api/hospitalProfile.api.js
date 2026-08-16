import { apiClient } from './client';

export async function fetchMyHospitalProfile() {
  const { data } = await apiClient.get('/hospital-profile');
  return data.data;
}

export async function updateHospitalProfile(payload) {
  const { data } = await apiClient.patch('/hospital-profile', payload);
  return data.data;
}

export async function submitHospitalProfileForReview() {
  const { data } = await apiClient.post('/hospital-profile/submit');
  return data.data;
}