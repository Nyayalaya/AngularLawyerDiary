// features/court/services/court.service.ts
import { Injectable } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';

import { BaseCrudService, ApiResponse } from '../../../core/services/base-crud.service';
import { Court } from '../models/court.model';
import { CreateCourtDto, UpdateCourtDto } from '../dtos/court.dto';
import { PaginatedResponse } from '../../../core/models/pagination.model';
import { ApiEndpoints } from '../../../core';

@Injectable({ providedIn: 'root' })
export class CourtService extends BaseCrudService<Court> {
   protected endpoint = ApiEndpoints.COURT.BASE_CONTROLLER_URL;

  // ── Getall mapped to your PaginatedResponse shape ──────────────────────
  // BaseCrudService.getAll returns ApiResponse<Court[]> — we map it to the
  // PaginatedResponse<Court> shape the store/effects expect.
  getCourts(pageNumber = 1, pageSize = 10): Observable<PaginatedResponse<Court>> {
    return this.getAll(pageNumber, pageSize).pipe(
      map((res: ApiResponse<Court[]>) => ({
        items:        res.data,
        totalRecords: res.pagination.totalCount,
        pageNumber:   res.pagination.pageNumber,
        pageSize:     res.pagination.pageSize,
        totalPages:   res.pagination.totalPages,
      }))
    );
  }

  // ── Create with typed DTO (BaseCrudService.create accepts T, we narrow it) 
  createCourt(payload: CreateCourtDto): Observable<Court> {
    return this.create(payload as unknown as Court);
  }

  // ── Update with typed DTO ───────────────────────────────────────────────
  updateCourt(id: string, payload: UpdateCourtDto): Observable<Court> {
    return this.update({ id, ...payload });
  }

  // ── Delete (alias for clarity in effects) ─────────────────────────────
  deleteCourt(id: string): Observable<void> {
    return this.deleteById(id);
  }

  // ── Batch create — forkJoin over the base create ───────────────────────
  createBatch(payloads: CreateCourtDto[]): Observable<Court[]> {
    return forkJoin(
      payloads.map((p) => this.createCourt(p))
    );
  }

  // ── Batch delete — forkJoin over the base deleteById ──────────────────
  deleteBatch(ids: string[]): Observable<string[]> {
    return forkJoin(
      ids.map((id) =>
        this.deleteCourt(id).pipe(map(() => id))
      )
    );
  }
}