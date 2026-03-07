import { API_CONFIG, API_ENDPOINTS } from '../lib/api-config';

// API Response type matching your backend
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T | null;
  errors: string[];
}

// Worker data structure from your API
import type { Worker } from '../types/api';
type WorkerData = Worker;

// Worker API Service
export class WorkerService {
  // Create new worker
  async createWorker(formData: FormData): Promise<ApiResponse<WorkerData>> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.WORKERS.CREATE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: formData
    });
    return response.json();
  }

  // Get worker by ID
  async getWorkerById(id: string): Promise<ApiResponse<WorkerData>> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.WORKERS.GET_BY_ID(id)}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    });
    const text = await response.text();
    if (!text) {
      return {
        success: false,
        message: `Empty response from server (status: ${response.status})`,
        data: null,
        errors: []
      };
    }
    try {
      return JSON.parse(text);
    } catch (err) {
      return {
        success: false,
        message: `Invalid JSON from server: ${err}. Raw response: ${text}`,
        data: null,
        errors: []
      };
    }
  }

  // Update existing worker
  async updateWorker(formData: FormData): Promise<ApiResponse<WorkerData>> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.WORKERS.UPDATE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: formData
    });
    const text = await response.text();
    if (!text) {
      return {
        success: false,
        message: `Empty response from server (status: ${response.status})`,
        data: null,
        errors: []
      };
    }
    try {
      return JSON.parse(text);
    } catch (err) {
      return {
        success: false,
        message: `Invalid JSON from server: ${err}. Raw response: ${text}`,
        data: null,
        errors: []
      };
    }
  }

  // Delete worker
  async deleteWorker(data: { id: string }): Promise<ApiResponse<void>> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.WORKERS.DELETE}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify(data)
    });
    return response.json();
  }

  // Get all workers
  async getAllWorkers(query?: any): Promise<ApiResponse<WorkerData[]>> {
    const response = await fetch(`${API_CONFIG.baseURL}${API_ENDPOINTS.WORKERS.LIST}`, {
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
export const workerService = new WorkerService();
