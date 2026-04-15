import { createReducer, on } from '@ngrx/store';
import * as A from './case-category.actions';
import { initialCaseCategoryState } from './case-category.state';

export const caseCategoryReducer = createReducer(
  initialCaseCategoryState,

  on(A.loadCaseCategories, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.loadCaseCategoriesSuccess, (state, { caseCategories, totalRecords, pageNumber, pageSize, totalPages }) => ({
    ...state,
    items: caseCategories,
    loading: false,
    loaded: true,
    lastFetched: Date.now(),
    totalRecords,
    pageNumber,
    pageSize,
    totalPages
  })),

  on(A.loadCaseCategoriesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(A.deleteCaseCategorySuccess, (state, { id }) => {
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

  on(A.updateCaseCategorySuccess, (state, { caseCategory }) => ({
    ...state,
    items: state.items.map(x => x.id === caseCategory.id ? caseCategory : x)
  })),

  on(A.addCaseCategorySuccess, (state, { caseCategory }) => ({
    ...state,
    items: [...state.items, caseCategory]
  }))
);
