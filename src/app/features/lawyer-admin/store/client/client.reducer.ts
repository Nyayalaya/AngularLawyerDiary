import { createReducer, on } from '@ngrx/store';

import * as A from './client.actions';
import { initialClientState } from './client.state';

export const clientReducer = createReducer(
  initialClientState,

  on(A.loadClients, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.loadClientsSuccess, (state, { clients, totalRecords, pageNumber, pageSize, totalPages }) => ({
    ...state,
    items: clients,
    loading: false,
    loaded: true,
    lastFetched: Date.now(),
    totalRecords,
    pageNumber,
    pageSize,
    totalPages
  })),

  on(A.loadClientsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(A.deleteClientSuccess, (state, { id }) => {
    // Item will be removed when loadClients completes
    // For now, just mark that we're waiting for the reload
    return {
      ...state,
      loading: true
    };
  }),

  on(A.updateClientSuccess, (state, { client }) => ({
    ...state,
    items: state.items.map(x => x.id === client.id ? client : x)
  })),

  on(A.addClientSuccess, (state, { client }) => ({
    ...state,
    items: [...state.items, client],
    error: null
  })),

  on(A.addClientFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(A.updateClientFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(A.deleteClientFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(A.clearError, (state) => ({
    ...state,
    error: null
  }))
);
