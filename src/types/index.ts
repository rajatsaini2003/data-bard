export interface User {
  id: number;
  email: string;
  is_admin: boolean;
  organization_id: number;
  organization_name?: string;
  created_at: string;
  status: 'active' | 'pending' | 'inactive';
}

export interface Organization {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  settings: OrganizationSettings;
}

export interface OrganizationSettings {
  max_datasets: number;
  allow_file_sharing: boolean;
  webhook_url?: string;
  api_key?: string;
}

export interface Dataset {
  id: number;
  name: string;
  filename: string;
  file_size: number;
  row_count: number;
  column_count: number;
  created_at: string;
  uploaded_by: number;
  uploader_name: string;
  status: 'processing' | 'ready' | 'error';
  description?: string;
  tags: string[];
}

export interface DataMapping {
  id: number;
  dataset_id: number;
  relationships: Relationship[];
  created_at: string;
  version: string;
  confidence_score: number;
}

export interface Relationship {
  id: string;
  from_table: string;
  from_column: string;
  to_table: string;
  to_column: string;
  confidence: number;
  relationship_type: 'one_to_one' | 'one_to_many' | 'many_to_many';
  status: 'detected' | 'confirmed' | 'rejected';
}

export interface ColumnInfo {
  name: string;
  dtype: string;
  pandas_dtype: string;
  nullable: boolean;
  position: number;
}

export interface TableSchema {
  table_name: string;
  columns: ColumnInfo[];
}

export interface DatasetSchema {
  schemas: Record<string, TableSchema>;
}

export interface DataPreview {
  columns: ColumnInfo[];
  rows: Record<string, any>[];
  total_rows: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface SignupData {
  email: string;
  password: string;
  organization_name?: string;
  full_name?: string;
  invite_token?: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: User;
}

export interface InviteRequest {
  email: string;
  role: 'admin' | 'user';
  message?: string;
}

export interface InviteResponse {
  id: number;
  email: string;
  role: string;
  status: 'pending' | 'accepted' | 'expired';
  created_at: string;
  expires_at: string;
}

export interface UploadProgress {
  file: File;
  progress: number;
  status: 'uploading' | 'processing' | 'complete' | 'error';
  error?: string;
  dataset_id?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ListParams {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  filters?: Record<string, any>;
}

export interface NotificationData {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action_url?: string;
}

export interface AuditLog {
  id: number;
  user_id: number;
  user_email: string;
  action: string;
  resource_type: string;
  resource_id: string;
  details: Record<string, any>;
  timestamp: string;
  ip_address: string;
}