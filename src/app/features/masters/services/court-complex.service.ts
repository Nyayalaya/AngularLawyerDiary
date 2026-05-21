import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseCrudService, ApiResponse } from '../../../core/services/base-crud.service';
import { CourtComplex } from '../models/court-complex.model';
import { CreateCourtComplexDto, UpdateCourtComplexDto } from '../dtos/court-complex.dto';
import { PaginatedResponse } from '../../../core/models/pagination.model';
import { ApiEndpoints } from '../../../core';

@Injectable({ providedIn: 'root' })
export class CourtComplexService extends BaseCrudService<CourtComplex> {
  protected endpoint = ApiEndpoints.COURT_COMPLEX.BASE_CONTROLLER_URL;

  // ── Getall mapped to PaginatedResponse shape ─────────────────────
  getCourtComplexes(pageNumber = 1, pageSize = 10): Observable<PaginatedResponse<CourtComplex>> {
    return this.getAll(pageNumber, pageSize).pipe(
      map((res: ApiResponse<CourtComplex[]>) => ({
        items:        res.data,
        totalRecords: res.pagination.totalCount,
        pageNumber:   res.pagination.pageNumber,
        pageSize:     res.pagination.pageSize,
        totalPages:   res.pagination.totalPages,
      }))
    );
  }

  // ── Create with typed DTO
  createCourtComplex(payload: CreateCourtComplexDto): Observable<CourtComplex> {
    return this.create(payload as unknown as CourtComplex);
  }

  // ── Update with typed DTO
  updateCourtComplex(id: string, payload: UpdateCourtComplexDto): Observable<CourtComplex> {
    return this.update({ id, ...payload });
  }

  // ── Delete
  deleteCourtComplex(id: string): Observable<void> {
    return this.deleteById(id);
  }

  // ── Batch create
  createBatch(payloads: CreateCourtComplexDto[]): Observable<CourtComplex[]> {
    return forkJoin(
      payloads.map((p) => this.createCourtComplex(p))
    );
  }

  // ── Batch delete
  deleteBatch(ids: string[]): Observable<string[]> {
    return forkJoin(
      ids.map((id) =>
        this.deleteCourtComplex(id).pipe(map(() => id))
      )
    );
  }
}
