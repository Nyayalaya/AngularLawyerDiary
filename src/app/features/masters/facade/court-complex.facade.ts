import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';

import { CourtComplex } from '../models/court-complex.model';
import { CreateCourtComplexDto, UpdateCourtComplexDto } from '../dtos/court-complex.dto';
import { PaginatedResponse, PaginationMeta } from '../../../core/models/pagination.model';
import { CourtComplexActions } from '../store/court-complex/court-complex.actions';
import {
  selectAllCourtComplexes,
  selectCourtComplexById,
  selectCourtComplexEntities,
  selectCourtComplexError,
  selectCourtComplexPagination,
  selectCourtComplexesBusy,
  selectCourtComplexesLoaded,
  selectCourtComplexesLoading,
  selectCourtComplexesSubmitting,
  selectCourtComplexTotalRecords,
  selectHasSelection,
  selectIsCourtComplexSelected,
  selectPhysicalComplexes,
  selectSelectedCourtComplexIds,
  selectSelectedCourtComplexes,
  selectSelectionCount,
  selectAllSelected,
  selectVirtualComplexes,
  selectCourtComplexesByState,
  selectCourtComplexesByDistrict,
  selectCourtComplexesByCourt,
} from '../store/court-complex/court-complex.selectors';

@Injectable({ providedIn: 'root' })
export class CourtComplexFacade {

  private readonly store = inject(Store);

  // ── Observables (read) ────────────────────────────────────────────────

  readonly courtComplexes$: Observable<CourtComplex[]> = this.store.select(selectAllCourtComplexes);

  readonly virtualComplexes$: Observable<CourtComplex[]> =
    this.store.select(selectVirtualComplexes);

  readonly physicalComplexes$: Observable<CourtComplex[]> =
    this.store.select(selectPhysicalComplexes);

  readonly loading$: Observable<boolean> =
    this.store.select(selectCourtComplexesLoading);

  readonly submitting$: Observable<boolean> =
    this.store.select(selectCourtComplexesSubmitting);

  readonly busy$: Observable<boolean> =
    this.store.select(selectCourtComplexesBusy);

  readonly loaded$: Observable<boolean> =
    this.store.select(selectCourtComplexesLoaded);

  readonly error$: Observable<string | null> =
    this.store.select(selectCourtComplexError);

  readonly pagination$: Observable<PaginationMeta> =
    this.store.select(selectCourtComplexPagination);

  readonly totalRecords$: Observable<number> =
    this.store.select(selectCourtComplexTotalRecords);

  // ── Selection observables ─────────────────────────────────────────────

  readonly selectedIds$: Observable<string[]> =
    this.store.select(selectSelectedCourtComplexIds);

  readonly selectedCourtComplexes$: Observable<CourtComplex[]> =
    this.store.select(selectSelectedCourtComplexes);

  readonly selectionCount$: Observable<number> =
    this.store.select(selectSelectionCount);

  readonly hasSelection$: Observable<boolean> =
    this.store.select(selectHasSelection);

  readonly allSelected$: Observable<boolean> =
    this.store.select(selectAllSelected);

  // ── Parameterised selectors ───────────────────────────────────────────

  courtComplexById$(id: string): Observable<CourtComplex | null> {
    return this.store.select(selectCourtComplexById(id));
  }

  isSelected$(id: string): Observable<boolean> {
    return this.store.select(selectIsCourtComplexSelected(id));
  }

  courtComplexesByState$(stateId: number): Observable<CourtComplex[]> {
    return this.store.select(selectCourtComplexesByState(stateId));
  }

  courtComplexesByDistrict$(districtId: string): Observable<CourtComplex[]> {
    return this.store.select(selectCourtComplexesByDistrict(districtId));
  }

  courtComplexesByCourt$(courtId: string): Observable<CourtComplex[]> {
    return this.store.select(selectCourtComplexesByCourt(courtId));
  }

  // ── Load / Query ──────────────────────────────────────────────────────

  loadCourtComplexes(pageNumber = 1, pageSize = 10): void {
    this.store.dispatch(CourtComplexActions.loadCourtComplexes({ pageNumber, pageSize }));
  }

  loadCourtComplexById(id: string): void {
    this.store.dispatch(CourtComplexActions.loadCourtComplexById({ id }));
  }

  // ── Pagination ────────────────────────────────────────────────────────

  setPage(pageNumber: number): void {
    this.store.dispatch(CourtComplexActions.setPage({ pageNumber }));
  }

  setPageSize(pageSize: number): void {
    this.store.dispatch(CourtComplexActions.setPageSize({ pageSize }));
  }

  // ── Write — single ────────────────────────────────────────────────────

  createCourtComplex(payload: CreateCourtComplexDto): void {
    this.store.dispatch(CourtComplexActions.createCourtComplex({ payload }));
  }

  updateCourtComplex(id: string, payload: UpdateCourtComplexDto): void {
    this.store.dispatch(CourtComplexActions.updateCourtComplex({ id, payload }));
  }

  deleteCourtComplex(id: string): void {
    this.store.dispatch(CourtComplexActions.deleteCourtComplex({ id }));
  }

  // ── Write — batch ─────────────────────────────────────────────────────

  createCourtComplexesBatch(payloads: CreateCourtComplexDto[]): void {
    this.store.dispatch(CourtComplexActions.createCourtComplexesBatch({ payloads }));
  }

  deleteCourtComplexesBatch(ids: string[]): void {
    this.store.dispatch(CourtComplexActions.deleteCourtComplexesBatch({ ids }));
  }

  deleteSelectedCourtComplexes(): void {
    this.store
      .select(selectSelectedCourtComplexIds)
      .pipe(take(1))
      .subscribe((ids) => {
        if (ids.length) {
          this.store.dispatch(CourtComplexActions.deleteCourtComplexesBatch({ ids }));
        }
      });
  }

  // ── Selection ─────────────────────────────────────────────────────────

  selectCourtComplex(id: string): void {
    this.store.dispatch(CourtComplexActions.selectCourtComplex({ id }));
  }

  deselectCourtComplex(id: string): void {
    this.store.dispatch(CourtComplexActions.deselectCourtComplex({ id }));
  }

  toggleCourtComplex(id: string): void {
    this.store
      .select(selectIsCourtComplexSelected(id))
      .pipe(take(1))
      .subscribe((selected) => {
        selected
          ? this.store.dispatch(CourtComplexActions.deselectCourtComplex({ id }))
          : this.store.dispatch(CourtComplexActions.selectCourtComplex({ id }));
      });
  }

  selectAll(): void {
    this.store.dispatch(CourtComplexActions.selectAllCourtComplexes());
  }

  clearSelection(): void {
    this.store.dispatch(CourtComplexActions.clearSelection());
  }
}
