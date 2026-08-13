import { apiClient } from './client';

export async function fetchHealthContent() {
  const { data } = await apiClient.get('/content/health');
  return data.data;
}