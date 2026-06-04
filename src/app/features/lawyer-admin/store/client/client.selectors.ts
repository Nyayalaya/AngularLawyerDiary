import { createFeatureSelector, createSelector } from '@ngrx/store';

import { ClientState } from './client.state';

export const selectClientState =
  createFeatureSelector<ClientState>('client');

export const selectAll = createSelector(selectClientState, s => s?.items ?? []);
export const selectLoading = createSelector(selectClientState, s => s?.loading ?? false);
export const selectError = createSelector(selectClientState, s => s?.error ?? undefined);
export const selectTotalRecords = createSelector(selectClientState, s => s?.totalRecords ?? 0);
export const selectPageNumber = createSelector(selectClientState, s => s?.pageNumber ?? 1);
export const selectPageSize = createSelector(selectClientState, s => s?.pageSize ?? 10);
export const selectTotalPages = createSelector(selectClientState, s => s?.totalPages ?? 0);
