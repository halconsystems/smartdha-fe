// API Configuration for Backend Integration
export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'https://dfpwebp.dhakarachi.org',
  swaggerUrl: process.env.NEXT_PUBLIC_SWAGGER_URL || 'https://dfpwebp.dhakarachi.org/swagger',
  timeout: 10000,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/api/smartdha/user/login',
    LOGOUT: '/api/smartdha/user/logout',
    REFRESH: '/api/smartdha/user/refresh', // if available
  },
  // Vehicles
  VEHICLES: {
    LIST: '/api/smartdha/vehicle/get-all-vehicles',
    CREATE: '/api/smartdha/vehicle/add-vehicle',
    UPDATE: '/api/smartdha/vehicle/update-vehicle',
    DELETE: '/api/smartdha/vehicle/delete',
    GET_BY_ID: (id: string) => `/api/smartdha/vehicle/${id}`,
  },
  // Residents
  RESIDENTS: {
    LIST: '/api/smartdha/resident/get-all-residents',
    CREATE: '/api/smartdha/resident/add-resident',
    UPDATE: '/api/smartdha/resident/update-resident',
    DELETE: '/api/smartdha/resident/delete',
    GET_BY_ID: (id: string) => `/api/smartdha/resident/${id}`,
  },
  // Properties
  PROPERTIES: {
    LIST: '/api/smartdha/property/get-all-properties',
    CREATE: '/api/smartdha/residenceproperty/create',
    UPDATE: '/api/smartdha/property/update-property',
    DELETE: '/api/smartdha/property/delete',
    GET_BY_ID: (id: string) => `/api/smartdha/property/${id}`,
  },
  // Visitors
  VISITORS: {
    LIST: '/api/smartdha/visitorpass/get-all-visitors',
    CREATE: '/api/smartdha/visitorpass/add-visitorpass',
    UPDATE: '/api/smartdha/visitorpass/update-visitorpass',
    DELETE: '/api/smartdha/visitorpass/delete-visitorpass',
    GET_BY_ID: (id: string) => `/api/smartdha/visitorpass/${id}`,
  },
  // Workers
  WORKERS: {
    LIST: '/api/smartdha/worker/get-all-workers',
    CREATE: '/api/smartdha/worker/add-worker',
    UPDATE: '/api/smartdha/worker/update-worker',
    DELETE: '/api/smartdha/worker/delete-worker',
    GET_BY_ID: (id: string) => `/api/smartdha/worker/get-worker-by-id/${id}`,
  },
  // Luggage
  LUGGAGE: {
    LIST: '/api/smartdha/luggagepass/getall',
    CREATE: '/api/smartdha/luggage/add-luggage',
    UPDATE: '/api/smartdha/luggage/update-luggage',
    DELETE: '/api/smartdha/luggage/delete',
    GET_BY_ID: (id: string) => `/api/smartdha/luggage/${id}`,
  },
  // Notifications
  NOTIFICATIONS: {
    LIST: '/api/smartdha/notification/get-all-notifications',
    MARK_READ: (id: string) => `/api/smartdha/notification/${id}/read`,
    MARK_ALL_READ: '/api/smartdha/notification/read-all',
  },
  // Dashboard
  DASHBOARD: {
    STATS: '/api/smartdha/dashboard/stats',
    MEMBER_STATS: '/api/smartdha/dashboard/member-stats',
  },
};