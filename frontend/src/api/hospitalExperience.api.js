import { apiClient } from './client';

export async function fetchPublicHospitalProfile(slug) {
  const { data } = await apiClient.get(`/hospital-profile/public/${slug}`);
  return data.data;
}

export async function fetchPublicDepartments(slug) {
  const { data } = await apiClient.get(`/departments/public/${slug}`);
  return data.data;
}

export async function fetchPublicDoctors(slug, departmentId) {
  const { data } = await apiClient.get(`/doctors/public/${slug}`, { params: departmentId ? { departmentId } : {} });
  return data.data;
}