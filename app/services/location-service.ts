// Update an existing pickup location
export async function updateLocation(id: string, zone: number, address: string) {
  const response = await apiClient.post<{ data: Location }>(
    '/api/smartdha/location/update-location',
    { id, zone, address }
  );
  return response.data;
}
// Create a new pickup location
export async function createLocation(zone: number, address: string) {
  const response = await apiClient.post<{ data: Location }>(
    '/api/smartdha/location/create-location',
    { zone, address }
  );
  return response.data;
}
import { apiClient } from '../lib/api-client';

export interface Location {
  id: string;
  zone: string;
  address: string;
  status: 'Active' | 'Inactive';
  createdAt: string;
}

export async function fetchAllLocations(): Promise<Location[]> {
  const response = await apiClient.post<{ data: { items: any[] } }>(
    '/api/smartdha/location/get-all-location',
    {
      pageNumber: 0,
      pageSize: 0,
    }
  );
  if (!Array.isArray(response.data?.items)) return [];
  return response.data.items.map((item) => ({
    ...item,
    status: item.status === true ? 'Active' : 'Inactive',
  }));
}
