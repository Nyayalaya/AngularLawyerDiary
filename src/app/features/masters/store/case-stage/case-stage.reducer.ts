import { createReducer, on } from '@ngrx/store';
import * as A from './case-stage.actions';
import { initialCaseStageState } from './case-stage.state';

export const caseStageReducer = createReducer(
  initialCaseStageState,

  on(A.loadCaseStages, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.loadCaseStagesSuccess, (state, { caseStages, totalRecords, pageNumber, pageSize, totalPages }) => ({
    ...state,
    items: caseStages,
    loading: false,
    loaded: true,
    lastFetched: Date.now(),
    totalRecords,
    pageNumber,
    pageSize,
    totalPages
  })),

  on(A.loadCaseStagesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(A.deleteCaseStageSuccess, (state, { id }) => {
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

  on(A.updateCaseStageSuccess, (state, { caseStage }) => ({
    ...state,
    items: state.items.map(x => x.id === caseStage.id ? caseStage : x)
  })),

  on(A.addCaseStageSuccess, (state, { caseStage }) => ({
    ...state,
    items: [...state.items, caseStage]
  }))
);
