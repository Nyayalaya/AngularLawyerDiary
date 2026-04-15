import { createReducer, on } from '@ngrx/store';
import * as A from './court-level.actions';
import { initialCourtLevelState } from './court-level.state';

export const courtLevelReducer = createReducer(
  initialCourtLevelState,

  on(A.loadCourtLevels, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.loadCourtLevelsSuccess, (state, { courtLevels, totalRecords, pageNumber, pageSize, totalPages }) => ({
    ...state,
    items: courtLevels,
    loading: false,
    loaded: true,
    lastFetched: Date.now(),
    totalRecords,
    pageNumber,
    pageSize,
    totalPages
  })),

  on(A.loadCourtLevelsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(A.deleteCourtLevelSuccess, (state, { id }) => {
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

  on(A.updateCourtLevelSuccess, (state, { courtLevel }) => ({
    ...state,
    items: state.items.map(x => x.id === courtLevel.id ? courtLevel : x)
  })),

  on(A.addCourtLevelSuccess, (state, { courtLevel }) => ({
    ...state,
    items: [...state.items, courtLevel]
  }))
);
