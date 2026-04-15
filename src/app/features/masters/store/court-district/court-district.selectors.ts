import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CourtDistrictState } from './court-district.state';

export const selectCourtDistrictMasterState =
  createFeatureSelector<CourtDistrictState>('courtDistrict');

export const selectAll           = createSelector(selectCourtDistrictMasterState, s => s?.items          ?? []);
export const selectLoading       = createSelector(selectCourtDistrictMasterState, s => s?.loading        ?? false);
export const selectError         = createSelector(selectCourtDistrictMasterState, s => s?.error          ?? null);
export const selectTotalRecords  = createSelector(selectCourtDistrictMasterState, s => s?.totalRecords   ?? 0);
export const selectPageNumber    = createSelector(selectCourtDistrictMasterState, s => s?.pageNumber     ?? 1);
export const selectPageSize      = createSelector(selectCourtDistrictMasterState, s => s?.pageSize       ?? 10);
export const selectTotalPages    = createSelector(selectCourtDistrictMasterState, s => s?.totalPages     ?? 0);
