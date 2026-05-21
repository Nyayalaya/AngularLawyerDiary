import { createFeatureSelector, createSelector } from '@ngrx/store';
import { courtComplexAdapter, CourtComplexState } from './court-complex.state';
import { CourtComplex } from '../../models/court-complex.model';

// ── Feature root ─────────────────────────────────────────────────────────────
export const selectCourtComplexFeature =
  createFeatureSelector<CourtComplexState>('courtComplexes');

// ── Entity adapter selectors ──────────────────────────────────────────────────
const { selectAll, selectEntities, selectIds, selectTotal } =
  courtComplexAdapter.getSelectors(selectCourtComplexFeature);

export const selectAllCourtComplexes    = selectAll;
export const selectCourtComplexEntities = selectEntities;
export const selectCourtComplexIds      = selectIds;
export const selectCourtComplexTotal    = selectTotal;

// ── Async state ───────────────────────────────────────────────────────────────
export const selectCourtComplexesLoading    = createSelector(selectCourtComplexFeature, (s) => s.loading);
export const selectCourtComplexesSubmitting = createSelector(selectCourtComplexFeature, (s) => s.submitting);
export const selectCourtComplexesLoaded     = createSelector(selectCourtComplexFeature, (s) => s.loaded);
export const selectCourtComplexError        = createSelector(selectCourtComplexFeature, (s) => s.error);
export const selectLastFetched             = createSelector(selectCourtComplexFeature, (s) => s.lastFetched);

// ── Pagination ────────────────────────────────────────────────────────────────
export const selectCourtComplexPageNumber  = createSelector(selectCourtComplexFeature, (s) => s.pageNumber);
export const selectCourtComplexPageSize    = createSelector(selectCourtComplexFeature, (s) => s.pageSize);
export const selectCourtComplexTotalRecords = createSelector(selectCourtComplexFeature, (s) => s.totalRecords);
export const selectCourtComplexTotalPages  = createSelector(selectCourtComplexFeature, (s) => s.totalPages);

export const selectCourtComplexPagination  = createSelector(
  selectCourtComplexFeature,
  ({ pageNumber, pageSize, totalRecords, totalPages }) => ({
    pageNumber, pageSize, totalRecords, totalPages,
  })
);

// ── Selection ─────────────────────────────────────────────────────────────────
export const selectSelectedCourtComplexIds = createSelector(
  selectCourtComplexFeature, (s) => s.selectedIds
);

export const selectSelectedCourtComplexes = createSelector(
  selectCourtComplexEntities,
  selectSelectedCourtComplexIds,
  (entities, ids) => ids.map((id) => entities[id]).filter(Boolean) as CourtComplex[]
);

export const selectSelectionCount = createSelector(
  selectSelectedCourtComplexIds, (ids) => ids.length
);

export const selectHasSelection = createSelector(
  selectSelectionCount, (count) => count > 0
);

export const selectAllSelected = createSelector(
  selectCourtComplexIds,
  selectSelectedCourtComplexIds,
  (all, selected) =>
    all.length > 0 && (all as string[]).every((id) => selected.includes(id))
);

export const selectIsCourtComplexSelected = (id: string) =>
  createSelector(selectSelectedCourtComplexIds, (ids) => ids.includes(id));

// ── Single entity ─────────────────────────────────────────────────────────────
export const selectCourtComplexById = (id: string) =>
  createSelector(selectCourtComplexEntities, (entities) => entities[id] ?? null);

// ── Derived / filtered views ──────────────────────────────────────────────────
export const selectVirtualComplexes = createSelector(
  selectAllCourtComplexes, (complexes) => complexes.filter((c) => c.isVirtualComplex)
);

export const selectPhysicalComplexes = createSelector(
  selectAllCourtComplexes, (complexes) => complexes.filter((c) => !c.isVirtualComplex)
);

export const selectCourtComplexesByState = (stateId: number) =>
  createSelector(selectAllCourtComplexes, (complexes) =>
    complexes.filter((c) => c.stateId === stateId)
  );

export const selectCourtComplexesByDistrict = (districtId: string) =>
  createSelector(selectAllCourtComplexes, (complexes) =>
    complexes.filter((c) => c.courtDistrictId === districtId)
  );

export const selectCourtComplexesByCourt = (courtId: string) =>
  createSelector(selectAllCourtComplexes, (complexes) =>
    complexes.filter((c) => c.courtId === courtId)
  );

// ── Busy / idle composite ─────────────────────────────────────────────────────
export const selectCourtComplexesBusy = createSelector(
  selectCourtComplexesLoading,
  selectCourtComplexesSubmitting,
  (loading, submitting) => loading || submitting
);

// ── Cache staleness helper (used in effect guard) ─────────────────────────────
export const selectIsCourtComplexCacheStale = (ttlMs = 5 * 60 * 1000) =>
  createSelector(
    selectCourtComplexesLoaded,
    selectLastFetched,
    (loaded, lastFetched) => {
      if (!loaded || lastFetched === null) return true;
      return Date.now() - lastFetched > ttlMs;
    }
  );
