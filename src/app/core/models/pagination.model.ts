export interface PaginatedResponse<T> {
  items: T[];
  totalRecords: number;
  totalPages: number;
  pageNumber: number;
  pageSize: number;
}

export type PaginationMeta = Omit<PaginatedResponse<never>, 'items'>;