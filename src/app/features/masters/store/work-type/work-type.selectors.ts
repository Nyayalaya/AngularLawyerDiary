import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WorkTypeState } from './work-type.state';

export const selectWorkTypeMasterState =
  createFeatureSelector<WorkTypeState>('workType');

export const selectAll           = createSelector(selectWorkTypeMasterState, s => s?.items          ?? []);
export const selectLoading       = createSelector(selectWorkTypeMasterState, s => s?.loading        ?? false);
export const selectError         = createSelector(selectWorkTypeMasterState, s => s?.error          ?? null);
export const selectTotalRecords  = createSelector(selectWorkTypeMasterState, s => s?.totalRecords   ?? 0);
export const selectPageNumber    = createSelector(selectWorkTypeMasterState, s => s?.pageNumber     ?? 1);
export const selectPageSize      = createSelector(selectWorkTypeMasterState, s => s?.pageSize       ?? 10);
export const selectTotalPages    = createSelector(selectWorkTypeMasterState, s => s?.totalPages     ?? 0);
