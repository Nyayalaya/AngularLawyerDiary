import { createReducer, on } from '@ngrx/store';
import * as A from './work.actions';
import { initialWorkState } from './work.state';

export const workReducer = createReducer(
  initialWorkState,

  on(A.loadWorks, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.loadWorksSuccess, (state, { works, totalRecords, pageNumber, pageSize, totalPages }) => ({
    ...state,
    items: works,
    loading: false,
    loaded: true,
    lastFetched: Date.now(),
    totalRecords,
    pageNumber,
    pageSize,
    totalPages
  })),

  on(A.loadWorksFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(A.deleteWorkSuccess, (state, { id }) => {
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

  on(A.updateWorkSuccess, (state, { work }) => ({
    ...state,
    items: state.items.map(x => x.id === work.id ? work : x)
  })),

  on(A.addWorkSuccess, (state, { work }) => ({
    ...state,
    items: [...state.items, work]
  }))
);
