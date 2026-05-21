// store/court/court.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { courtAdapter, CourtState } from './court.state';
import { Court } from '../../models/court.model';

// ── Feature root ─────────────────────────────────────────────────────────────
export const selectCourtFeature =
  createFeatureSelector<CourtState>('courts');

// ── Entity adapter selectors ──────────────────────────────────────────────────
const { selectAll, selectEntities, selectIds, selectTotal } =
  courtAdapter.getSelectors(selectCourtFeature);

export const selectAllCourts    = selectAll;
export const selectCourtEntities = selectEntities;
export const selectCourtIds      = selectIds;
export const selectCourtTotal    = selectTotal;      // count in current page dict

// ── Async state ───────────────────────────────────────────────────────────────
export const selectCourtsLoading    = createSelector(selectCourtFeature, (s) => s.loading);
export const selectCourtsSubmitting = createSelector(selectCourtFeature, (s) => s.submitting);
export const selectCourtsLoaded     = createSelector(selectCourtFeature, (s) => s.loaded);
export const selectCourtError       = createSelector(selectCourtFeature, (s) => s.error);
export const selectLastFetched      = createSelector(selectCourtFeature, (s) => s.lastFetched);

// ── Pagination ────────────────────────────────────────────────────────────────
export const selectCourtPageNumber  = createSelector(selectCourtFeature, (s) => s.pageNumber);
export const selectCourtPageSize    = createSelector(selectCourtFeature, (s) => s.pageSize);
export const selectCourtTotalRecords = createSelector(selectCourtFeature, (s) => s.totalRecords);
export const selectCourtTotalPages  = createSelector(selectCourtFeature, (s) => s.totalPages);

export const selectCourtPagination  = createSelector(
  selectCourtFeature,
  ({ pageNumber, pageSize, totalRecords, totalPages }) => ({
    pageNumber, pageSize, totalRecords, totalPages,
  })
);

// ── Selection ─────────────────────────────────────────────────────────────────
export const selectSelectedCourtIds = createSelector(
  selectCourtFeature, (s) => s.selectedIds
);

export const selectSelectedCourts = createSelector(
  selectCourtEntities,
  selectSelectedCourtIds,
  (entities, ids) => ids.map((id) => entities[id]).filter(Boolean) as Court[]
);

export const selectSelectionCount = createSelector(
  selectSelectedCourtIds, (ids) => ids.length
);

export const selectHasSelection = createSelector(
  selectSelectionCount, (count) => count > 0
);

export const selectAllSelected = createSelector(
  selectCourtIds,
  selectSelectedCourtIds,
  (all, selected) =>
    all.length > 0 && (all as string[]).every((id) => selected.includes(id))
);

export const selectIsCourtSelected = (id: string) =>
  createSelector(selectSelectedCourtIds, (ids) => ids.includes(id));

// ── Single entity ─────────────────────────────────────────────────────────────
export const selectCourtById = (id: string) =>
  createSelector(selectCourtEntities, (entities) => entities[id] ?? null);

// ── Derived / filtered views ──────────────────────────────────────────────────
export const selectVirtualCourts = createSelector(
  selectAllCourts, (courts) => courts.filter((c) => c.isVirtualCourt)
);

export const selectPhysicalCourts = createSelector(
  selectAllCourts, (courts) => courts.filter((c) => !c.isVirtualCourt)
);

export const selectCourtsByState = (stateId: number) =>
  createSelector(selectAllCourts, (courts) =>
    courts.filter((c) => c.stateId === stateId)
  );

export const selectCourtsByDistrict = (districtId: string) =>
  createSelector(selectAllCourts, (courts) =>
    courts.filter((c) => c.courtDistrictId === districtId)
  );

// ── Busy / idle composite ─────────────────────────────────────────────────────
export const selectCourtsBusy = createSelector(
  selectCourtsLoading,
  selectCourtsSubmitting,
  (loading, submitting) => loading || submitting
);

// ── Cache staleness helper (used in effect guard) ─────────────────────────────
export const selectIsCacheStale = (ttlMs = 5 * 60 * 1000) =>
  createSelector(
    selectCourtsLoaded,
    selectLastFetched,
    (loaded, lastFetched) => {
      if (!loaded || lastFetched === null) return true;
      return Date.now() - lastFetched > ttlMs;
    }
  );