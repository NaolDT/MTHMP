import { apiClient } from './client';

export async function uploadImage(file, category) {
  const formData = new FormData();
  formData.append('image', file);
  formData.append('category', category);

  const { data } = await apiClient.post('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
}