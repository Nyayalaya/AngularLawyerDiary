import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CaseCategoryState } from './case-category.state';

export const selectCaseCategoryMasterState =
  createFeatureSelector<CaseCategoryState>('caseCategory');

export const selectAll           = createSelector(selectCaseCategoryMasterState, s => s?.items          ?? []);
export const selectLoading       = createSelector(selectCaseCategoryMasterState, s => s?.loading        ?? false);
export const selectError         = createSelector(selectCaseCategoryMasterState, s => s?.error          ?? null);
export const selectTotalRecords  = createSelector(selectCaseCategoryMasterState, s => s?.totalRecords   ?? 0);
export const selectPageNumber    = createSelector(selectCaseCategoryMasterState, s => s?.pageNumber     ?? 1);
export const selectPageSize      = createSelector(selectCaseCategoryMasterState, s => s?.pageSize       ?? 10);
export const selectTotalPages    = createSelector(selectCaseCategoryMasterState, s => s?.totalPages     ?? 0);
