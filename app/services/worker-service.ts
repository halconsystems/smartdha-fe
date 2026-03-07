import { API_CONFIG, API_ENDPOINTS } from '../lib/api-config';

// API Response type matching your backend
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  errors: string[];
}

// Worker data structure from your API
interface WorkerData {
  name: string;
  cnic: string;
  phoneNo: string;
  dob: string;
  workerCardNo: string | null;
  policeVerification: boolean;
  isActive: boolean;
  image: string;
  jobType: number;
  workerCardDeliveryType: number;
}

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
    return response.json();
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
    return response.json();
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
