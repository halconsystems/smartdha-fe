import { API_CONFIG, API_ENDPOINTS } from '../lib/api-config';

// API Response type matching your backend
interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
  errors: string[];
}

// Vehicle data structure from your API
interface VehicleData {
  id: string;
  licenseNo: number;
  license: string;
  year: string;
  color: string;
  make: string;
  model: string;
  eTagId: string | null;
  validTo: string | null;
  validFrom: string | null;
  owner: string;
  status: boolean;
  modifiedDate: string;
}

// Create response type for vehicle creation
interface CreateVehicleResponse {
  succeeded: boolean;
  data?: any;
  errors?: any;
}

// Vehicle API Service
export class VehicleService {
  // Create new vehicle (with FormData for file upload and query params)
  async createVehicle(formData: FormData, queryParams: string): Promise<CreateVehicleResponse> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.VEHICLES.CREATE}?${queryParams}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: formData
    });
    return response.json();
  }

  // Update existing vehicle (with FormData for file upload)
  async updateVehicle(formData: FormData): Promise<ApiResponse<VehicleData>> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.VEHICLES.UPDATE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: formData
    });
    return response.json();
  }

  // Delete vehicle
  async deleteVehicle(data: { id: string | null }): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.VEHICLES.DELETE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Get vehicle by ID
  async getVehicleById(id: string): Promise<ApiResponse<VehicleData>> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.VEHICLES.GET_BY_ID(id)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });
    return response.json();
  }

  // Get all vehicles
  async getAllVehicles(query?: any): Promise<ApiResponse<VehicleData[]>> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.VEHICLES.LIST}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify(query || {})
    });
    return response.json();
  }

  private getAuthToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }
}

// Export singleton instance
export const vehicleService = new VehicleService();
