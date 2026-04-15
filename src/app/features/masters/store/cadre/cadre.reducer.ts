import { createReducer, on } from '@ngrx/store';
import * as A from './cadre.actions';
import { initialCadreState } from './cadre.state';

export const cadreReducer = createReducer(
  initialCadreState,

  on(A.loadCadres, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.loadCadresSuccess, (state, { cadres, totalRecords, pageNumber, pageSize, totalPages }) => ({
    ...state,
    items: cadres,
    loading: false,
    loaded: true,
    lastFetched: Date.now(),
    totalRecords,
    pageNumber,
    pageSize,
    totalPages
  })),

  on(A.loadCadresFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(A.deleteCadreSuccess, (state, { id }) => {
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

  on(A.updateCadreSuccess, (state, { cadre }) => ({
    ...state,
    items: state.items.map(x => x.id === cadre.id ? cadre : x)
  })),

  on(A.addCadreSuccess, (state, { cadre }) => ({
    ...state,
    items: [...state.items, cadre]
  }))
);
