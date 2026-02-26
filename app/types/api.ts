// TypeScript types from Swagger API documentation

// ─── Enums ────────────────────────────────────────────────────────────────

export enum CategoryType {
  RESIDENTIAL = 1,
  COMMERCIAL = 2,
}

export enum MemberType {
  RESIDENT = 1,
  COMMERCIAL_EMPLOYEE = 2,
  EDUCATIONAL_VISITOR = 3,
  HOUSE_HELP_WORKER = 4,
  OTHER = 5,
}

export enum Zone {
  ZONE_1 = 1,
  ZONE_2 = 2,
  ZONE_3 = 3,
  ZONE_4 = 4,
  ZONE_5 = 5,
  ZONE_6 = 6,
  ZONE_7 = 7,
  ZONE_8 = 8,
}

export enum RelationUserFamily {
  SELF = 1,
  SPOUSE = 2,
  SON = 3,
  DAUGHTER = 4,
  FATHER = 5,
  MOTHER = 6,
  BROTHER = 7,
  SISTER = 8,
  OTHER = 9,
}

export enum ResidenceStatusDha {
  OWNER = 1,
  TENANT = 2,
}

export enum Phase {
  PHASE_1 = 1,
  PHASE_2 = 2,
  PHASE_3 = 3,
  PHASE_4 = 4,
  PHASE_5 = 5,
  PHASE_6 = 6,
  PHASE_7 = 7,
  PHASE_8 = 8,
}

export enum PropertyTypeCommercial {
  SHOP = 1,
  OFFICE = 2,
  BUILDING = 3,
}

export enum PropertyTypeResidential {
  HOUSE = 1,
  APARTMENT = 2,
  FLAT = 3,
}

export enum JobType {
  DRIVER = 1,
  COOK = 2,
  MAID = 3,
  GUARD = 4,
  GARDENER = 5,
  OTHER = 6,
}

export enum WorkerCardDeliveryType {
  COLLECTED = 1,
  DELIVERED = 2,
  PENDING = 3,
}

export enum VisitorPassType {
  DAY_PASS = 1,
  LONG_STAY = 2
}

// ─── Authentication Types ───────────────────────────────────────────────────

export interface LoginRequest {
  cnic: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  name: string;
  cnic: string;
  email?: string;
  phone?: string;
  memberType: MemberType;
  isActive: boolean;
}

// ─── Luggage Pass Types ───────────────────────────────────────────────────

export interface CreateLuggagePassCommand {
  name: string;
  cnic: string;
  vehicleLicensePlate?: string;
  vehicleLicenseNo?: number;
  description?: string;
  validityDate?: string; 
}

export interface UpdateLuggagePassCommand {
  id: string; // UUID
  name?: string;
  cnic?: string;
  vehicleLicensePlate?: string;
  vehicleLicenseNo?: number;
  description?: string;
  validFrom?: string; // ISO date-time
  validTo?: string; // ISO date-time
}

export interface LuggagePass {
  id: string;
  name: string;
  cnic: string;
  vehicleLicensePlate?: string;
  vehicleLicenseNo?: number;
  description?: string;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Property Types ─────────────────────────────────────────────────────

export interface CreatePropertyCommand {
  category: CategoryType;
  type: number; // PropertyTypeResidential or PropertyTypeCommercial
  phase: Phase;
  zone: Zone;
  khayaban: string;
  floor?: number;
  unit?: string;
  address?: string;
  attachment?: File;
}

export interface UpdatePropertyCommand {
  id: string; // UUID
  category?: CategoryType;
  type?: number;
  phase?: Phase;
  zone?: Zone;
  khayaban?: string;
  floor?: number;
  unit?: string;
  address?: string;
  attachment?: File;
}

export interface Property {
  id: string;
  category: CategoryType;
  type: number;
  phase: Phase;
  zone: Zone;
  khayaban: string;
  floor?: number;
  unit?: string;
  address?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Vehicle Types ───────────────────────────────────────────────────────

export interface CreateVehicleCommand {
  color: string;
  make: string;
  model: string;
  attachment?: File;
}

export interface UpdateVehicleCommand {
  id: string; // UUID
  color?: string;
  make?: string;
  model?: string;
  attachment?: File;
}

export interface DeleteVehicleCommand {
  id: string; // UUID
}

export interface Vehicle {
  id: string | null;
  color: string;
  eTagId:string | null;
  license: string;
  licenseNo: number;
  make: string;
  model: string;
  year: string;
  ownership: string | null;
  isActive: boolean | null;
  validTo: string;
  validFrom: string;
}


// ─── Visitor Pass Types ───────────────────────────────────────────────────

export interface CreateVisitorPassCommand {
  name?: string;
  cnic?: string;
  vehicleLicensePlate?: string;
  vehicleLicenseNo?: number;
  visitorPassType: VisitorPassType;
  validFrom: string; // ISO date-time
  validTo: string; // ISO date-time
}

export interface UpdateVisitorPassCommand {
  id: string; // UUID
  name?: string;
  cnic?: string;
  vehicleLicensePlate?: string;
  vehicleLicenseNo?: number;
  visitorPassType?: VisitorPassType;
  validFrom?: string; // ISO date-time
  validTo?: string; // ISO date-time
}

export interface VisitorPass {
  id: string;
  name?: string;
  cnic?: string;
  vehicleLicensePlate?: string;
  vehicleLicenseNo?: number;
  visitorPassType: VisitorPassType;
  validFrom: string;
  validTo: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteVisitorPassCommand {
  id: string; // UUID
}

export interface GetVisitorPassGroupedQuery {
  id?: string;
}

// ─── Worker Types ─────────────────────────────────────────────────────────

export interface CreateWorkerCommand {
  name: string;
  cnic: string;
  jobType: JobType;
  cardDeliveryType: WorkerCardDeliveryType;
  attachment?: File;
}

export interface UpdateWorkerCommand {
  id: string; // UUID
  name?: string;
  cnic?: string;
  jobType?: JobType;
  cardDeliveryType?: WorkerCardDeliveryType;
  attachment?: File;
}

export interface DeleteWorkerCommand {
  id: string; // UUID
}

export interface Worker {
  id: string;
  name: string;
  cnic: string;
  jobType: JobType;
  cardDeliveryType: WorkerCardDeliveryType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Query Types ─────────────────────────────────────────────────────────

export interface GetAllPropertiesQuery {
  id?: string;
  isActive: boolean;
}

export interface GetAllUserFamilyQuery {
  id?: string;
}

export interface GetAllWorkerQuery {
  id?: string;
}

export interface GetVehicleListQuery {
  id?: string;
}

// ─── Common API Response Types ───────────────────────────────────────────

export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface EnumResponse {
  value: string;
  label: string;
}
