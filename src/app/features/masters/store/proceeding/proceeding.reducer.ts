import { createReducer, on } from '@ngrx/store';
import * as A from './proceeding.actions';
import { initialProceedingState } from './proceeding.state';

export const proceedingReducer = createReducer(
  initialProceedingState,

  on(A.loadProceedings, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.loadProceedingsSuccess, (state, { proceedings, totalRecords, pageNumber, pageSize, totalPages }) => ({
    ...state,
    items: proceedings,
    loading: false,
    loaded: true,
    lastFetched: Date.now(),
    totalRecords,
    pageNumber,
    pageSize,
    totalPages
  })),

  on(A.loadProceedingsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(A.deleteProceedingSuccess, (state, { id }) => {
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

  on(A.updateProceedingSuccess, (state, { proceeding }) => ({
    ...state,
    items: state.items.map(x => x.id === proceeding.id ? proceeding : x)
  })),

  on(A.addProceedingSuccess, (state, { proceeding }) => ({
    ...state,
    items: [...state.items, proceeding]
  }))
);
