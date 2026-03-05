import { apiClient } from '../lib/api-client';
import { API_CONFIG, API_ENDPOINTS } from '../lib/api-config';
import { 
  CreateLuggagePassCommand, 
  UpdateLuggagePassCommand, 
  LuggagePass
} from '../types/api';

// API Response type matching your backend
interface ApiResponse<T = any> {
  data: T;
  message: string;
  upcomingLuggage: any []; // Adjust type as needed
  previousLuggage: any []; // Adjust type as needed
  success: boolean;
  errors: string[];
}

// Create response type for luggage pass creation
interface CreateLuggageResponse {
  succeeded: boolean;
  data?: any;
  errors?: any;
}
export interface LuggagePassesResponse {
  upcoming: LuggagePass[];
  previous: LuggagePass[];
}
// Luggage Pass API Service
export class LuggageService {
  private readonly baseUrl = '/api/smartdha/luggagepass';

  // Create new luggage pass
  async createLuggagePass(data: CreateLuggagePassCommand): Promise<CreateLuggageResponse> {
    return apiClient.post(`${this.baseUrl}/create-luggagepass`, data);
  }

  // Update existing luggage pass
  async updateLuggagePass(data: UpdateLuggagePassCommand): Promise<ApiResponse<LuggagePass>> {
    // Extract id and update data, send specific user ID as query parameter
    const { id, ...updateData } = data;
    const loggedInUserId = this.getLoggedInUserId();
    const requestData = {
      id: id, // Include luggage pass ID in body as well
      ...updateData
    };
    return apiClient.post(`${this.baseUrl}/update-luggagepass?Id=${loggedInUserId}`, requestData);
  }

  // Helper method to get logged-in user ID
  private getLoggedInUserId(): string {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('loggedInUserId') || '8374841e-ab5b-454e-8294-e7a484237c96';
    }
    return '8374841e-ab5b-454e-8294-e7a484237c96';
  }

  // Get luggage pass by ID
  async getLuggagePassById(id: string): Promise<ApiResponse<LuggagePass>> {
    return apiClient.get(`${this.baseUrl}/${id}`);
  }

  // Delete luggage pass
  async deleteLuggagePass(id: string): Promise<ApiResponse<void>> {
    return apiClient.post(`${this.baseUrl}/delete-luggagepass?id=${id}`);
  }

  // Get all luggage passes (upcoming and previous)
  async getAllLuggagePasses(): Promise<ApiResponse<LuggagePassesResponse>> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.LUGGAGE.LIST}`, {
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
export const luggageService = new LuggageService();
