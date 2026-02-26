import { API_CONFIG, API_ENDPOINTS } from '../lib/api-config';

// API Response type matching your backend
interface ApiResponse<T = any> {
  succeeded: boolean;
  message: string;
  data: T;
  errors: string[];
}

// Visitor API response with separate arrays
interface VisitorListResponse {
  success: boolean;
  message: string;
  upcomingVisitors: any[];
  previousVisitors: any[];
}

// Visitor data structure from your API
interface VisitorData {
  id: string;
  name: string;
  cnic: string;
  purpose: string;
  vehicleInfo?: string;
  visitDate?: string;
  validFrom?: string;
  validTo?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Create response type for visitor creation
interface CreateVisitorResponse {
  succeeded: boolean;
  data?: VisitorData;
  message?: string;
  errors?: any;
}

// Visitor API Service
export class VisitorService {
  // Create new visitor pass
  async createVisitor(formData: FormData): Promise<CreateVisitorResponse> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.VISITORS.CREATE}`, {
      method: 'POST',
      headers: {
        'Authorization': `${this.getAuthToken()}`
      },
      body: formData
    });
    return response.json();
  }

  // Quick add visitor
  async quickAddVisitor(data: any): Promise<ApiResponse<VisitorData>> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.VISITORS.CREATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'Authorization': `${this.getAuthToken()}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Update existing visitor
  async updateVisitor(formData: FormData): Promise<ApiResponse<VisitorData>> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.VISITORS.UPDATE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: formData
    });
    return response.json();
  }

  // Delete visitor
  async deleteVisitor(data: { id: string }): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.VISITORS.DELETE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Get visitor by ID
  async getVisitorById(id: string): Promise<ApiResponse<VisitorData>> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.VISITORS.GET_BY_ID(id)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });
    return response.json();
  }

  // Get all visitors
  async getAllVisitors(query?: any): Promise<VisitorListResponse> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.VISITORS.LIST}`, {
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
export const visitorService = new VisitorService();
