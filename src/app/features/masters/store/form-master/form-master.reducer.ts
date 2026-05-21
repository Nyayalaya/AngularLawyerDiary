import { createReducer, on } from '@ngrx/store';
import * as A from './form-master.actions';
import { initialFormMasterState } from './form-master.state';

export const formMasterReducer = createReducer(
  initialFormMasterState,

  on(A.loadFormMasters, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.loadFormMastersSuccess, (state, { formMasters, totalRecords, pageNumber, pageSize, totalPages }) => ({
    ...state,
    items: formMasters,
    loading: false,
    loaded: true,
    lastFetched: Date.now(),
    totalRecords,
    pageNumber,
    pageSize,
    totalPages
  })),

  on(A.loadFormMastersFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(A.deleteFormMasterSuccess, (state, { id }) => {
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

  on(A.updateFormMasterSuccess, (state, { formMaster }) => ({
    ...state,
    items: state.items.map(x => x.id === formMaster.id ? formMaster : x)
  })),

  on(A.addFormMasterSuccess, (state, { formMaster }) => ({
    ...state,
    items: [...state.items, formMaster]
  }))
);
