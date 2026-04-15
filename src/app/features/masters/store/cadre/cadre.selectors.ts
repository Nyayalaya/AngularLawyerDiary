import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CadreState } from './cadre.state';

export const selectCadreMasterState =
  createFeatureSelector<CadreState>('cadre');

export const selectAll           = createSelector(selectCadreMasterState, s => s?.items          ?? []);
export const selectLoading       = createSelector(selectCadreMasterState, s => s?.loading        ?? false);
export const selectError         = createSelector(selectCadreMasterState, s => s?.error          ?? null);
export const selectTotalRecords  = createSelector(selectCadreMasterState, s => s?.totalRecords   ?? 0);
export const selectPageNumber    = createSelector(selectCadreMasterState, s => s?.pageNumber     ?? 1);
export const selectPageSize      = createSelector(selectCadreMasterState, s => s?.pageSize       ?? 10);
export const selectTotalPages    = createSelector(selectCadreMasterState, s => s?.totalPages     ?? 0);
