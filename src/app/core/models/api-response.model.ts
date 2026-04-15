export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  statusCode: number;
  timestamp: string;
  errors: string[];
}