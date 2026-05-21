import { createReducer, on } from '@ngrx/store';
import * as A from './form-type.actions';
import { initialFormTypeState } from './form-type.state';

export const formTypeReducer = createReducer(
  initialFormTypeState,

  on(A.loadFormTypes, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.loadFormTypesSuccess, (state, { formTypes, totalRecords, pageNumber, pageSize, totalPages }) => ({
    ...state,
    items: formTypes,
    loading: false,
    loaded: true,
    lastFetched: Date.now(),
    totalRecords,
    pageNumber,
    pageSize,
    totalPages
  })),

  on(A.loadFormTypesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(A.deleteFormTypeSuccess, (state, { id }) => {
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

  on(A.updateFormTypeSuccess, (state, { formType }) => ({
    ...state,
    items: state.items.map(x => x.id === formType.id ? formType : x)
  })),

  on(A.addFormTypeSuccess, (state, { formType }) => ({
    ...state,
    items: [...state.items, formType]
  }))
);
