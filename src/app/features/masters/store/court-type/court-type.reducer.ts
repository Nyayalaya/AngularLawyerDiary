import { createReducer, on } from '@ngrx/store';
import * as A from './court-type.actions';
import { initialCourtTypeState } from './court-type-state';

export const courtTypeReducer = createReducer(
  initialCourtTypeState,

  on(A.loadCourtTypes, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.loadCourtTypesSuccess, (state, { courtTypes, totalRecords, pageNumber, pageSize, totalPages }) => ({
    ...state,
    items: courtTypes,
    loading: false,
    loaded: true,
    lastFetched: Date.now(),
    totalRecords,
    pageNumber,
    pageSize,
    totalPages
  })),

  on(A.loadCourtTypesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(A.deleteCourtTypeSuccess, (state, { id }) => {
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

  on(A.updateCourtTypeSuccess, (state, { courtType }) => ({
    ...state,
    items: state.items.map(x => x.id === courtType.id ? courtType : x)
  })),

  on(A.addCourtTypeSuccess, (state, { courtType }) => ({
    ...state,
    items: [...state.items, courtType]
  }))
);
