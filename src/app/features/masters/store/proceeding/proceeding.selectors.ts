import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProceedingState } from './proceeding.state';

export const selectProceedingMasterState =
  createFeatureSelector<ProceedingState>('proceeding');

export const selectAll           = createSelector(selectProceedingMasterState, s => s?.items          ?? []);
export const selectLoading       = createSelector(selectProceedingMasterState, s => s?.loading        ?? false);
export const selectError         = createSelector(selectProceedingMasterState, s => s?.error          ?? null);
export const selectTotalRecords  = createSelector(selectProceedingMasterState, s => s?.totalRecords   ?? 0);
export const selectPageNumber    = createSelector(selectProceedingMasterState, s => s?.pageNumber     ?? 1);
export const selectPageSize      = createSelector(selectProceedingMasterState, s => s?.pageSize       ?? 10);
export const selectTotalPages    = createSelector(selectProceedingMasterState, s => s?.totalPages     ?? 0);
