import { createAction, props } from '@ngrx/store';
import { CourtLevel } from '../../models/court-level.model';

export const loadCourtLevels = createAction(
  '[CourtLevel] Load',
  props<{ pageNumber?: number; pageSize?: number; force?: boolean }>()
);

export const loadCourtLevelsSuccess = createAction(
  '[CourtLevel] Load Success',
  props<{ courtLevels: CourtLevel[], 
    totalRecords: number, 
    pageNumber: number, 
    pageSize: number,
    totalPages: number }>()
);

export const loadCourtLevelsFailure = createAction(
  '[CourtLevel] Load Failure',
  props<{ error: string }>()
);

// ADD
export const addCourtLevel = createAction(
  '[CourtLevel] Add',
  props<{ courtLevel: CourtLevel }>()
);

export const addCourtLevelSuccess = createAction(
  '[CourtLevel] Add Success',
  props<{ courtLevel: CourtLevel }>()
);

export const addCourtLevelFailure = createAction(
  '[CourtLevel] Add Failure',
  props<{ error: string }>()
);

// UPDATE
export const updateCourtLevel = createAction(
  '[CourtLevel] Update',
  props<{ courtLevel: CourtLevel }>()
);

export const updateCourtLevelSuccess = createAction(
  '[CourtLevel] Update Success',
  props<{ courtLevel: CourtLevel }>()
);

export const updateCourtLevelFailure = createAction(
  '[CourtLevel] Update Failure',
  props<{ error: string }>()
);

// DELETE
export const deleteCourtLevel = createAction(
  '[CourtLevel] Delete',
  props<{ id: string }>()
);

export const deleteCourtLevelSuccess = createAction(
  '[CourtLevel] Delete Success',
  props<{ id: string }>()
);

export const deleteCourtLevelFailure = createAction(
  '[CourtLevel] Delete Failure',
  props<{ error: string }>()
);
