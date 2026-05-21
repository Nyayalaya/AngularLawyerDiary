import { createReducer, on } from '@ngrx/store';
import * as A from './proceeding-type.actions';
import { initialProceedingTypeState } from './proceeding-type.state';

export const proceedingTypeReducer = createReducer(
  initialProceedingTypeState,

  on(A.loadProceedingTypes, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.loadProceedingTypesSuccess, (state, { proceedingTypes, totalRecords, pageNumber, pageSize, totalPages }) => ({
    ...state,
    items: proceedingTypes,
    loading: false,
    loaded: true,
    lastFetched: Date.now(),
    totalRecords,
    pageNumber,
    pageSize,
    totalPages
  })),

  on(A.loadProceedingTypesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(A.deleteProceedingTypeSuccess, (state, { id }) => {
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

  on(A.updateProceedingTypeSuccess, (state, { proceedingType }) => ({
    ...state,
    items: state.items.map(x => x.id === proceedingType.id ? proceedingType : x)
  })),

  on(A.addProceedingTypeSuccess, (state, { proceedingType }) => ({
    ...state,
    items: [...state.items, proceedingType]
  }))
);
