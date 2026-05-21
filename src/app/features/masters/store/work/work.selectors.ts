import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WorkState } from './work.state';

export const selectWorkMasterState =
  createFeatureSelector<WorkState>('work');

export const selectAll           = createSelector(selectWorkMasterState, s => s?.items          ?? []);
export const selectLoading       = createSelector(selectWorkMasterState, s => s?.loading        ?? false);
export const selectError         = createSelector(selectWorkMasterState, s => s?.error          ?? null);
export const selectTotalRecords  = createSelector(selectWorkMasterState, s => s?.totalRecords   ?? 0);
export const selectPageNumber    = createSelector(selectWorkMasterState, s => s?.pageNumber     ?? 1);
export const selectPageSize      = createSelector(selectWorkMasterState, s => s?.pageSize       ?? 10);
export const selectTotalPages    = createSelector(selectWorkMasterState, s => s?.totalPages     ?? 0);
