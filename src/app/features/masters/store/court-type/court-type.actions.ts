import { createAction, props } from '@ngrx/store';
import { CourtTypeModel } from '../../models/court-type.model';

export const loadCourtTypes = createAction(
  '[CourtType] Load',
  props<{ pageNumber?: number; pageSize?: number; force?: boolean }>()
);

export const loadCourtTypesSuccess = createAction(
  '[CourtType] Load Success',
  props<{ courtTypes: CourtTypeModel[], 
    totalRecords: number, 
    pageNumber: number, 
    pageSize: number,
    totalPages: number }>()
);

export const loadCourtTypesFailure = createAction(
  '[CourtType] Load Failure',
  props<{ error: string }>()
);

// ADD
export const addCourtType = createAction(
  '[CourtType] Add',
  props<{ courtType: CourtTypeModel }>()
);

export const addCourtTypeSuccess = createAction(
  '[CourtType] Add Success',
  props<{ courtType: CourtTypeModel }>()
);

export const addCourtTypeFailure = createAction(
  '[CourtType] Add Failure',
  props<{ error: string }>()
);

// UPDATE
export const updateCourtType = createAction(
  '[CourtType] Update',
  props<{ courtType: CourtTypeModel }>()
);

export const updateCourtTypeSuccess = createAction(
  '[CourtType] Update Success',
  props<{ courtType: CourtTypeModel }>()
);

export const updateCourtTypeFailure = createAction(
  '[CourtType] Update Failure',
  props<{ error: string }>()
);

// DELETE
export const deleteCourtType = createAction(
  '[CourtType] Delete',
  props<{ id: string }>()
);

export const deleteCourtTypeSuccess = createAction(
  '[CourtType] Delete Success',
  props<{ id: string }>()
);

export const deleteCourtTypeFailure = createAction(
  '[CourtType] Delete Failure',
  props<{ error: string }>()
);
