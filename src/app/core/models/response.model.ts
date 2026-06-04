/**
 * Generic Response Wrapper for handling both success and error states
 * 
 * Usage:
 * Success: Response<Client> = { status: 'success', data: client }
 * Error: Response<null> = { status: 'error', message: 'Error message' }
 */

export interface Response<T = unknown> {
  status: 'success' | 'error';
  message?: string;
  data?: T;
  errors?: string[];
}

/**
 * Generic Result type for observable streams
 * Can be used in store state management for consistent success/error handling
 */
export interface Result<T = unknown> {
  isLoading: boolean;
  data: T | null;
  error: string | undefined;
}

/**
 * Generic async operation state
 */
export const createInitialResult = <T>(): Result<T> => ({
  isLoading: false,
  data: null,
  error: undefined
});

/**
 * Helper to create success result
 */
export const successResult = <T>(data: T): Result<T> => ({
  isLoading: false,
  data,
  error: undefined
});

/**
 * Helper to create error result
 */
export const errorResult = <T>(error: string): Result<T> => ({
  isLoading: false,
  data: null,
  error
});

/**
 * Helper to create loading result
 */
export const loadingResult = <T>(data?: T | null): Result<T> => ({
  isLoading: true,
  data: data ?? null,
  error: undefined
});
