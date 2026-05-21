import { createAction, props } from '@ngrx/store';
import { WorkType } from '../../models/work-type.model';

export const loadWorkTypes = createAction(
  '[WorkType] Load',
  props<{ pageNumber?: number; pageSize?: number; force?: boolean }>()
);

export const loadWorkTypesSuccess = createAction(
  '[WorkType] Load Success',
  props<{ workTypes: WorkType[], 
    totalRecords: number, 
    pageNumber: number, 
    pageSize: number,
    totalPages: number }>()
);

export const loadWorkTypesFailure = createAction(
  '[WorkType] Load Failure',
  props<{ error: string }>()
);

// ADD
export const addWorkType = createAction(
  '[WorkType] Add',
  props<{ workType: WorkType }>()
);

export const addWorkTypeSuccess = createAction(
  '[WorkType] Add Success',
  props<{ workType: WorkType }>()
);

export const addWorkTypeFailure = createAction(
  '[WorkType] Add Failure',
  props<{ error: string }>()
);

// UPDATE
export const updateWorkType = createAction(
  '[WorkType] Update',
  props<{ workType: WorkType }>()
);

export const updateWorkTypeSuccess = createAction(
  '[WorkType] Update Success',
  props<{ workType: WorkType }>()
);

export const updateWorkTypeFailure = createAction(
  '[WorkType] Update Failure',
  props<{ error: string }>()
);

// DELETE
export const deleteWorkType = createAction(
  '[WorkType] Delete',
  props<{ id: string }>()
);

export const deleteWorkTypeSuccess = createAction(
  '[WorkType] Delete Success',
  props<{ id: string }>()
);

export const deleteWorkTypeFailure = createAction(
  '[WorkType] Delete Failure',
  props<{ error: string }>()
);
