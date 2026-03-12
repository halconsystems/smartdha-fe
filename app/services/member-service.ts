import { apiClient } from '../lib/api-client';

export async function fetchMemberById(id: string) {
  const response = await apiClient.post<{ data: any }>(
    '/api/smartdha/nonmemberregistration/get-member-by-id',
    { id }
  );
  return response.data;
}
