// store/state/state.reducer.ts

import { createReducer, on } from '@ngrx/store';
import * as StateActions from './m-state.actions';
import { initialStateState } from './m-state.state';

export const stateReducer = createReducer(

  initialStateState,

  // 🔹 Load List
  on(StateActions.loadStates, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(StateActions.loadStatesSuccess, (state, payload) => ({
    ...state,
    loading: false,
    loaded: true,
    items: payload.items,
    totalRecords: payload.totalRecords,
    pageNumber: payload.pageNumber,
    pageSize: payload.pageSize,
    totalPages: payload.totalPages,
    lastFetched: Date.now()
  })),

  on(StateActions.loadStatesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  // 🔹 Load By Id
  on(StateActions.loadStateById, (state) => ({
    ...state,
    loading: true
  })),

  on(StateActions.loadStateByIdSuccess, (state, { state: data }) => ({
    ...state,
    loading: false,
    selected: data
  })),

  on(StateActions.loadStateByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
