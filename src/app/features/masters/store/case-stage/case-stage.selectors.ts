import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CaseStageState } from './case-stage.state';

export const selectCaseStageMasterState =
  createFeatureSelector<CaseStageState>('caseStage');

export const selectAll           = createSelector(selectCaseStageMasterState, s => s?.items          ?? []);
export const selectLoading       = createSelector(selectCaseStageMasterState, s => s?.loading        ?? false);
export const selectError         = createSelector(selectCaseStageMasterState, s => s?.error          ?? null);
export const selectTotalRecords  = createSelector(selectCaseStageMasterState, s => s?.totalRecords   ?? 0);
export const selectPageNumber    = createSelector(selectCaseStageMasterState, s => s?.pageNumber     ?? 1);
export const selectPageSize      = createSelector(selectCaseStageMasterState, s => s?.pageSize       ?? 10);
export const selectTotalPages    = createSelector(selectCaseStageMasterState, s => s?.totalPages     ?? 0);
