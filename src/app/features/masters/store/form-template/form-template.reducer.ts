import { createReducer, on } from '@ngrx/store';
import * as A from './form-template.actions';
import { initialFormTemplateState } from './form-template.state';

export const formTemplateReducer = createReducer(
  initialFormTemplateState,

  on(A.loadFormTemplates, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.loadFormTemplatesSuccess, (state, { formTemplates, totalRecords, pageNumber, pageSize, totalPages }) => ({
    ...state,
    items: formTemplates,
    loading: false,
    loaded: true,
    lastFetched: Date.now(),
    totalRecords,
    pageNumber,
    pageSize,
    totalPages
  })),

  on(A.loadFormTemplatesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(A.deleteFormTemplateSuccess, (state, { id }) => {
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

  on(A.updateFormTemplateSuccess, (state, { formTemplate }) => ({
    ...state,
    items: state.items.map(x => x.id === formTemplate.id ? formTemplate : x)
  })),

  on(A.addFormTemplateSuccess, (state, { formTemplate }) => ({
    ...state,
    items: [...state.items, formTemplate]
  }))
);