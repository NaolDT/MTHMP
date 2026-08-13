import { apiClient } from './client';

export async function submitContactInquiry(payload) {
  const { data } = await apiClient.post('/contact', payload);
  return data.data;
}