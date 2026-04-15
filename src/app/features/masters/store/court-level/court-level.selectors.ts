import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CourtLevelState } from './court-level.state';

export const selectCourtLevelMasterState =
  createFeatureSelector<CourtLevelState>('courtLevel');

export const selectAll           = createSelector(selectCourtLevelMasterState, s => s?.items          ?? []);
export const selectLoading       = createSelector(selectCourtLevelMasterState, s => s?.loading        ?? false);
export const selectError         = createSelector(selectCourtLevelMasterState, s => s?.error          ?? null);
export const selectTotalRecords  = createSelector(selectCourtLevelMasterState, s => s?.totalRecords   ?? 0);
export const selectPageNumber    = createSelector(selectCourtLevelMasterState, s => s?.pageNumber     ?? 1);
export const selectPageSize      = createSelector(selectCourtLevelMasterState, s => s?.pageSize       ?? 10);
export const selectTotalPages    = createSelector(selectCourtLevelMasterState, s => s?.totalPages     ?? 0);
