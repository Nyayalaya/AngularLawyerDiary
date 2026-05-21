import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormMasterState } from './form-master.state';

export const selectFormMasterMasterState =
  createFeatureSelector<FormMasterState>('formMaster');

export const selectAll           = createSelector(selectFormMasterMasterState, s => s?.items          ?? []);
export const selectLoading       = createSelector(selectFormMasterMasterState, s => s?.loading        ?? false);
export const selectError         = createSelector(selectFormMasterMasterState, s => s?.error          ?? null);
export const selectTotalRecords  = createSelector(selectFormMasterMasterState, s => s?.totalRecords   ?? 0);
export const selectPageNumber    = createSelector(selectFormMasterMasterState, s => s?.pageNumber     ?? 1);
export const selectPageSize      = createSelector(selectFormMasterMasterState, s => s?.pageSize       ?? 10);
export const selectTotalPages    = createSelector(selectFormMasterMasterState, s => s?.totalPages     ?? 0);
