import { createReducer, on } from '@ngrx/store';
import * as A from './form-subtype.actions';
import { initialFormSubTypeState } from './form-subtype.state';

export const formSubTypeReducer = createReducer(
  initialFormSubTypeState,

  on(A.loadFormSubTypes, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.loadFormSubTypesSuccess, (state, { formSubTypes, totalRecords, pageNumber, pageSize, totalPages }) => ({
    ...state,
    items: formSubTypes,
    loading: false,
    loaded: true,
    lastFetched: Date.now(),
    totalRecords,
    pageNumber,
    pageSize,
    totalPages
  })),

  on(A.loadFormSubTypesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(A.deleteFormSubTypeSuccess, (state, { id }) => {
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

  on(A.updateFormSubTypeSuccess, (state, { formSubType }) => ({
    ...state,
    items: state.items.map(x => x.id === formSubType.id ? formSubType : x)
  })),

  on(A.addFormSubTypeSuccess, (state, { formSubType }) => ({
    ...state,
    items: [...state.items, formSubType]
  }))
);
