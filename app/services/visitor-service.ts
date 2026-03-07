import { API_CONFIG, API_ENDPOINTS } from '../lib/api-config';
import { authService } from './auth-service';
import type { VisitorPass } from '../types/api';

// API Response type matching your backend
interface ApiResponse<T = any> {
  // backend varies between succeeded/success in this codebase,
  // so keep this loose and normalize at call sites if needed
  succeeded?: boolean;
  success?: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface VisitorPassesResponse {
  upcoming: VisitorPass[];
  previous: VisitorPass[];
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
        'Authorization': `Bearer ${this.getAuthToken()}` 
      },
      body: JSON.stringify(data)
    });
  
    if (!response.ok) {
      const error = await response.text();
      console.error('API Error:', response.status, error);
      throw new Error(`API Error: ${response.status}`);
    }
  
    return response.json();
  }

  // Update existing visitor (send JSON)
  async updateVisitor(data: any): Promise<ApiResponse<VisitorData>> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.VISITORS.UPDATE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Delete visitor
  async deleteVisitor(data: { id: string, Name?: string, Description?: string }): Promise<ApiResponse<void>> {
    // id as query param only, no body
    const params = new URLSearchParams({ id: data.id });
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.VISITORS.DELETE}?${params.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });
    if (!response.ok) {
      const error = await response.text();
      console.error('API Error:', response.status, error);
      try {
        const json = JSON.parse(error);
        console.error('API Error JSON:', json);
      } catch (e) {
        // Not JSON, just log raw error
      }
      throw new Error(`API Error: ${response.status}`);
    }
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

  async getAllVisitorPasses(): Promise<ApiResponse<VisitorPassesResponse>> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.VISITORS.LIST}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'accept': '*/*',
        'Authorization': `Bearer ${this.getAuthToken()}`,
      },
      body: JSON.stringify({}) // Send empty object to avoid null request error
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('API Error:', response.status, error);
      throw new Error(`API Error: ${response.status}`);
    }

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
