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
    const newItems = state.items.filter(x => x.id !== id);
    const newTotal = Math.max(0, state.totalRecords - 1);
    const newTotalPages = state.pageSize ? Math.max(1, Math.ceil(newTotal / state.pageSize)) : 1;

    return {
      ...state,
      items: newItems,
      totalRecords: newTotal,
      pageNumber: Math.min(state.pageNumber, newTotalPages),
      totalPages: newTotalPages
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
