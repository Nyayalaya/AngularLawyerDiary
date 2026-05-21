import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormSubTypeState } from './form-subtype.state';

export const selectFormSubTypeMasterState =
  createFeatureSelector<FormSubTypeState>('formSubType');

export const selectAll           = createSelector(selectFormSubTypeMasterState, s => s?.items          ?? []);
export const selectLoading       = createSelector(selectFormSubTypeMasterState, s => s?.loading        ?? false);
export const selectError         = createSelector(selectFormSubTypeMasterState, s => s?.error          ?? null);
export const selectTotalRecords  = createSelector(selectFormSubTypeMasterState, s => s?.totalRecords   ?? 0);
export const selectPageNumber    = createSelector(selectFormSubTypeMasterState, s => s?.pageNumber     ?? 1);
export const selectPageSize      = createSelector(selectFormSubTypeMasterState, s => s?.pageSize       ?? 10);
export const selectTotalPages    = createSelector(selectFormSubTypeMasterState, s => s?.totalPages     ?? 0);
