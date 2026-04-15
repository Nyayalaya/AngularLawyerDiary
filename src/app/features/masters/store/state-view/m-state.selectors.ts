import { createFeatureSelector, createSelector } from '@ngrx/store';
import { StateState } from './m-state.state';

export const selectStateMasterState =
  createFeatureSelector<StateState>('state');

export const selectAll    = createSelector(selectStateMasterState, s => s?.items        ?? []);
export const selectLoading = createSelector(selectStateMasterState, s => s?.loading      ?? false);
export const selectError   = createSelector(selectStateMasterState, s => s?.error        ?? null);
export const selectTotalRecords     = createSelector(selectStateMasterState, s => s?.totalRecords ?? 0);
export const selectPageNumber       = createSelector(selectStateMasterState, s => s?.pageNumber   ?? 1);
export const selectPageSize         = createSelector(selectStateMasterState, s => s?.pageSize     ?? 10);
export const selectTotalPages       = createSelector(selectStateMasterState, s => s?.totalPages   ?? 0);