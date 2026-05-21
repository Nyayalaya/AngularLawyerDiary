export interface DataIntegration {
  id: string;
  name: string;
  type: 'api' | 'excel' | 'json';
  source: string; // URL for API, file path for files
  description: string;
  isActive: boolean;
  lastSync?: string;
  syncStatus?: 'success' | 'failed' | 'pending';
  mapping?: DataMapping[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DataMapping {
  sourceField: string;
  targetField: string;
  dataType: 'string' | 'number' | 'date' | 'boolean';
  required: boolean;
  defaultValue?: any;
}

export interface IntegrationResult {
  success: boolean;
  message: string;
  recordsProcessed: number;
  errors?: string[];
}