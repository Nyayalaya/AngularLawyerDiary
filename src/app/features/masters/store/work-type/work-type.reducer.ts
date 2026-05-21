import { createReducer, on } from '@ngrx/store';
import * as A from './work-type.actions';
import { initialWorkTypeState } from './work-type.state';

export const workTypeReducer = createReducer(
  initialWorkTypeState,

  on(A.loadWorkTypes, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.loadWorkTypesSuccess, (state, { workTypes, totalRecords, pageNumber, pageSize, totalPages }) => ({
    ...state,
    items: workTypes,
    loading: false,
    loaded: true,
    lastFetched: Date.now(),
    totalRecords,
    pageNumber,
    pageSize,
    totalPages
  })),

  on(A.loadWorkTypesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(A.deleteWorkTypeSuccess, (state, { id }) => {
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

  on(A.updateWorkTypeSuccess, (state, { workType }) => ({
    ...state,
    items: state.items.map(x => x.id === workType.id ? workType : x)
  })),

  on(A.addWorkTypeSuccess, (state, { workType }) => ({
    ...state,
    items: [...state.items, workType]
  }))
);
