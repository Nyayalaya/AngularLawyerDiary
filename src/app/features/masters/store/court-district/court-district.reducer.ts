import { createReducer, on } from '@ngrx/store';
import * as A from './court-district.actions';
import { initialCourtDistrictState } from './court-district.state';

export const courtDistrictReducer = createReducer(
  initialCourtDistrictState,

  on(A.loadCourtDistricts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.loadCourtDistrictsSuccess, (state, { courtDistricts, totalRecords, pageNumber, pageSize, totalPages }) => ({
    ...state,
    items: courtDistricts,
    loading: false,
    loaded: true,
    lastFetched: Date.now(),
    totalRecords,
    pageNumber,
    pageSize,
    totalPages
  })),

  on(A.loadCourtDistrictsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(A.deleteCourtDistrictSuccess, (state, { id }) => {
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

  on(A.updateCourtDistrictSuccess, (state, { courtDistrict }) => ({
    ...state,
    items: state.items.map(x => x.id === courtDistrict.id ? courtDistrict : x)
  })),

  on(A.addCourtDistrictSuccess, (state, { courtDistrict }) => ({
    ...state,
    items: [...state.items, courtDistrict]
  })),

  on(A.submitDistrictsByState, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.submitDistrictsByStateSuccess, (state, { courtDistricts }) => ({
    ...state,
    items: courtDistricts,
    loading: false,
    loaded: true,
    lastFetched: Date.now()
  })),

  on(A.submitDistrictsByStateFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);
