// features/court/facades/court.facade.ts
import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, take } from 'rxjs';

import { Court } from '../models/court.model';
import { CreateCourtDto, UpdateCourtDto } from '../dtos/court.dto';
import { PaginatedResponse, PaginationMeta } from '../../../core/models/pagination.model';
import { CourtActions } from '../store/court/court.actions';
import {
  selectAllCourts,
  selectCourtById,
  selectCourtEntities,
  selectCourtError,
  selectCourtPagination,
  selectCourtsBusy,
  selectCourtsLoaded,
  selectCourtsLoading,
  selectCourtsSubmitting,
  selectCourtTotalRecords,
  selectHasSelection,
  selectIsCourtSelected,
  selectPhysicalCourts,
  selectSelectedCourtIds,
  selectSelectedCourts,
  selectSelectionCount,
  selectAllSelected,
  selectVirtualCourts,
  selectCourtsByState,
  selectCourtsByDistrict,
} from '../store/court/court.selectors';

@Injectable({ providedIn: 'root' })
export class CourtFacade {

  private readonly store = inject(Store);

  // ── Observables (read) ────────────────────────────────────────────────

  /** Full list of courts in the current page */
  readonly courts$: Observable<Court[]> = this.store.select(selectAllCourts);

  /** Only virtual courts */
  readonly virtualCourts$: Observable<Court[]> =
    this.store.select(selectVirtualCourts);

  /** Only physical courts */
  readonly physicalCourts$: Observable<Court[]> =
    this.store.select(selectPhysicalCourts);

  /** True while GET is in-flight */
  readonly loading$: Observable<boolean> =
    this.store.select(selectCourtsLoading);

  /** True while POST / PATCH / DELETE is in-flight */
  readonly submitting$: Observable<boolean> =
    this.store.select(selectCourtsSubmitting);

  /** True if either loading or submitting */
  readonly busy$: Observable<boolean> =
    this.store.select(selectCourtsBusy);

  /** True after first successful load */
  readonly loaded$: Observable<boolean> =
    this.store.select(selectCourtsLoaded);

  /** Latest error message, null when clean */
  readonly error$: Observable<string | null> =
    this.store.select(selectCourtError);

  /** Pagination snapshot — pageNumber, pageSize, totalRecords, totalPages */
  readonly pagination$: Observable<PaginationMeta> =
  this.store.select(selectCourtPagination);

  /** Total server-side record count */
  readonly totalRecords$: Observable<number> =
    this.store.select(selectCourtTotalRecords);

  // ── Selection observables ─────────────────────────────────────────────

  /** Array of selected court IDs */
  readonly selectedIds$: Observable<string[]> =
    this.store.select(selectSelectedCourtIds);

  /** Full Court objects for selected IDs */
  readonly selectedCourts$: Observable<Court[]> =
    this.store.select(selectSelectedCourts);

  /** Number of selected courts */
  readonly selectionCount$: Observable<number> =
    this.store.select(selectSelectionCount);

  /** True if at least one court is selected */
  readonly hasSelection$: Observable<boolean> =
    this.store.select(selectHasSelection);

  /** True if every court on the current page is selected */
  readonly allSelected$: Observable<boolean> =
    this.store.select(selectAllSelected);

  // ── Parameterised selectors ───────────────────────────────────────────

  /** Single court by ID — returns null if not in store */
  courtById$(id: string): Observable<Court | null> {
    return this.store.select(selectCourtById(id));
  }

  /** Is a specific court currently selected? */
  isSelected$(id: string): Observable<boolean> {
    return this.store.select(selectIsCourtSelected(id));
  }

  /** Courts filtered by stateId */
  courtsByState$(stateId: number): Observable<Court[]> {
    return this.store.select(selectCourtsByState(stateId));
  }

  /** Courts filtered by districtId */
  courtsByDistrict$(districtId: string): Observable<Court[]> {
    return this.store.select(selectCourtsByDistrict(districtId));
  }

  // ── Load / Query ──────────────────────────────────────────────────────

  /**
   * Load a page of courts.
   * The effect will skip the HTTP call if the cache is still fresh.
   */
  loadCourts(pageNumber = 1, pageSize = 10): void {
    this.store.dispatch(CourtActions.loadCourts({ pageNumber, pageSize }));
  }

  /** Load a single court into the entity dictionary */
  loadCourtById(id: string): void {
    this.store.dispatch(CourtActions.loadCourtById({ id }));
  }

  // ── Pagination ────────────────────────────────────────────────────────

  /** Navigate to a specific page — effect re-triggers loadCourts */
  setPage(pageNumber: number): void {
    this.store.dispatch(CourtActions.setPage({ pageNumber }));
  }

  /** Change page size — resets to page 1, effect re-triggers loadCourts */
  setPageSize(pageSize: number): void {
    this.store.dispatch(CourtActions.setPageSize({ pageSize }));
  }

  // ── Write — single ────────────────────────────────────────────────────

  /** POST a new court */
  createCourt(payload: CreateCourtDto): void {
    this.store.dispatch(CourtActions.createCourt({ payload }));
  }

  /** PATCH an existing court */
  updateCourt(id: string, payload: UpdateCourtDto): void {
    this.store.dispatch(CourtActions.updateCourt({ id, payload }));
  }

  /** DELETE a court by ID */
  deleteCourt(id: string): void {
    this.store.dispatch(CourtActions.deleteCourt({ id }));
  }

  // ── Write — batch ─────────────────────────────────────────────────────

  /** POST multiple courts in parallel */
  createCourtsBatch(payloads: CreateCourtDto[]): void {
    this.store.dispatch(CourtActions.createCourtsBatch({ payloads }));
  }

  /** DELETE multiple courts in parallel */
  deleteCourtsBatch(ids: string[]): void {
    this.store.dispatch(CourtActions.deleteCourtsBatch({ ids }));
  }

  /** DELETE all currently selected courts in one batch */
  deleteSelectedCourts(): void {
    this.store
      .select(selectSelectedCourtIds)
      .pipe(take(1))
      .subscribe((ids) => {
        if (ids.length) {
          this.store.dispatch(CourtActions.deleteCourtsBatch({ ids }));
        }
      });
  }

  // ── Selection ─────────────────────────────────────────────────────────

  selectCourt(id: string): void {
    this.store.dispatch(CourtActions.selectCourt({ id }));
  }

  deselectCourt(id: string): void {
    this.store.dispatch(CourtActions.deselectCourt({ id }));
  }

  /** Toggle selection state of a single court */
  toggleCourt(id: string): void {
    this.store
      .select(selectIsCourtSelected(id))
      .pipe(take(1))
      .subscribe((selected) => {
        selected
          ? this.store.dispatch(CourtActions.deselectCourt({ id }))
          : this.store.dispatch(CourtActions.selectCourt({ id }));
      });
  }

  /** Select all courts on the current page */
  selectAll(): void {
    this.store.dispatch(CourtActions.selectAllCourts());
  }

  /** Deselect everything */
  clearSelection(): void {
    this.store.dispatch(CourtActions.clearSelection());
  }

  // ── UI resets ─────────────────────────────────────────────────────────

  clearError(): void {
    this.store.dispatch(CourtActions.clearError());
  }

  /** Wipe the entire slice back to initialState — useful on module destroy */
  reset(): void {
    this.store.dispatch(CourtActions.resetCourtState());
  }
}