// court-type.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CourtTypeState } from './court-type-state';


export const selectCourtTypeState =
  createFeatureSelector<CourtTypeState>('courtType');

export const selectAllCourtTypes    = createSelector(selectCourtTypeState, s => s?.items        ?? []);
export const selectCourtTypeLoading = createSelector(selectCourtTypeState, s => s?.loading      ?? false);
export const selectCourtTypeError   = createSelector(selectCourtTypeState, s => s?.error        ?? null);
export const selectTotalRecords     = createSelector(selectCourtTypeState, s => s?.totalRecords ?? 0);
export const selectPageNumber       = createSelector(selectCourtTypeState, s => s?.pageNumber   ?? 1);
export const selectPageSize         = createSelector(selectCourtTypeState, s => s?.pageSize     ?? 10);
export const selectTotalPages       = createSelector(selectCourtTypeState, s => s?.totalPages   ?? 0);