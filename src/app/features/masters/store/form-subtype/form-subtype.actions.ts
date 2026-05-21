import { createAction, props } from '@ngrx/store';
import { FormSubTypeModel } from '../../models/form-sub-type-model';

export const loadFormSubTypes = createAction(
  '[FormSubType] Load',
  props<{ pageNumber?: number; pageSize?: number; force?: boolean }>()
);

export const loadFormSubTypesSuccess = createAction(
  '[FormSubType] Load Success',
  props<{ formSubTypes: FormSubTypeModel[], 
    totalRecords: number, 
    pageNumber: number, 
    pageSize: number,
    totalPages: number }>()
);

export const loadFormSubTypesFailure = createAction(
  '[FormSubType] Load Failure',
  props<{ error: string }>()
);

// ADD
export const addFormSubType = createAction(
  '[FormSubType] Add',
  props<{ formSubType: FormSubTypeModel }>()
);

export const addFormSubTypeSuccess = createAction(
  '[FormSubType] Add Success',
  props<{ formSubType: FormSubTypeModel }>()
);

export const addFormSubTypeFailure = createAction(
  '[FormSubType] Add Failure',
  props<{ error: string }>()
);

// UPDATE
export const updateFormSubType = createAction(
  '[FormSubType] Update',
  props<{ formSubType: FormSubTypeModel }>()
);

export const updateFormSubTypeSuccess = createAction(
  '[FormSubType] Update Success',
  props<{ formSubType: FormSubTypeModel }>()
);

export const updateFormSubTypeFailure = createAction(
  '[FormSubType] Update Failure',
  props<{ error: string }>()
);

// DELETE
export const deleteFormSubType = createAction(
  '[FormSubType] Delete',
  props<{ id: string }>()
);

export const deleteFormSubTypeSuccess = createAction(
  '[FormSubType] Delete Success',
  props<{ id: string }>()
);

export const deleteFormSubTypeFailure = createAction(
  '[FormSubType] Delete Failure',
  props<{ error: string }>()
);
