import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProceedingTypeState } from './proceeding-type.state';

export const selectProceedingTypeMasterState =
  createFeatureSelector<ProceedingTypeState>('proceedingType');

export const selectAll           = createSelector(selectProceedingTypeMasterState, s => s?.items          ?? []);
export const selectLoading       = createSelector(selectProceedingTypeMasterState, s => s?.loading        ?? false);
export const selectError         = createSelector(selectProceedingTypeMasterState, s => s?.error          ?? null);
export const selectTotalRecords  = createSelector(selectProceedingTypeMasterState, s => s?.totalRecords   ?? 0);
export const selectPageNumber    = createSelector(selectProceedingTypeMasterState, s => s?.pageNumber     ?? 1);
export const selectPageSize      = createSelector(selectProceedingTypeMasterState, s => s?.pageSize       ?? 10);
export const selectTotalPages    = createSelector(selectProceedingTypeMasterState, s => s?.totalPages     ?? 0);
