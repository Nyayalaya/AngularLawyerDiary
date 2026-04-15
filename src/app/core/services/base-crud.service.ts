// core/services/base-crud.service.ts

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseService } from './base-service';

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  statusCode: number;
  timestamp: string;
  data: T;
  pagination: {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
  };
}

export abstract class BaseCrudService<T> extends BaseService {

  // 👇 Each child must define its endpoint
  protected abstract endpoint: string;

  /* =========================================
     GET ALL (WITH PAGINATION)
  ========================================= */
  getAll(pageNumber = 1, pageSize = 10): Observable<ApiResponse<T[]>> {
    return this.get<ApiResponse<T[]>>(this.endpoint, {
      pageNumber,
      pageSize
    });
  }

  /* =========================================
     GET BY ID
  ========================================= */
  getById(id: string | number): Observable<T> {
    return this.get<ApiResponse<T>>(`${this.endpoint}/${id}`)
      .pipe(map(res => res.data));
  }

  /* =========================================
     CREATE
  ========================================= */
  create(model: T): Observable<T> {
    const payload: any = { ...model };

    // remove empty id
    if (!payload.id) {
      delete payload.id;
    }

    return this.post<T>(this.endpoint, payload);
  }

  /* =========================================
     UPDATE
  ========================================= */
  update(model: any): Observable<T> {
    return this.put<T>(`${this.endpoint}/${model.id}`, model);
  }

  /* =========================================
     DELETE
  ========================================= */
  deleteById(id: string | number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${id}`);
  }
}
