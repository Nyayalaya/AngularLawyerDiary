import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormTypeState } from './form-type.state';

export const selectFormTypeMasterState =
  createFeatureSelector<FormTypeState>('formType');

export const selectAll           = createSelector(selectFormTypeMasterState, s => s?.items          ?? []);
export const selectLoading       = createSelector(selectFormTypeMasterState, s => s?.loading        ?? false);
export const selectError         = createSelector(selectFormTypeMasterState, s => s?.error          ?? null);
export const selectTotalRecords  = createSelector(selectFormTypeMasterState, s => s?.totalRecords   ?? 0);
export const selectPageNumber    = createSelector(selectFormTypeMasterState, s => s?.pageNumber     ?? 1);
export const selectPageSize      = createSelector(selectFormTypeMasterState, s => s?.pageSize       ?? 10);
export const selectTotalPages    = createSelector(selectFormTypeMasterState, s => s?.totalPages     ?? 0);
