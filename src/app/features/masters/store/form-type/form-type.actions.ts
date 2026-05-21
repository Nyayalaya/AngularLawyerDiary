import { createAction, props } from '@ngrx/store';
import { FormTypeModel } from '../../models/form-type.model';

export const loadFormTypes = createAction(
  '[FormType] Load',
  props<{ pageNumber?: number; pageSize?: number; force?: boolean }>()
);

export const loadFormTypesSuccess = createAction(
  '[FormType] Load Success',
  props<{ formTypes: FormTypeModel[], 
    totalRecords: number, 
    pageNumber: number, 
    pageSize: number,
    totalPages: number }>()
);

export const loadFormTypesFailure = createAction(
  '[FormType] Load Failure',
  props<{ error: string }>()
);

// ADD
export const addFormType = createAction(
  '[FormType] Add',
  props<{ formType: FormTypeModel }>()
);

export const addFormTypeSuccess = createAction(
  '[FormType] Add Success',
  props<{ formType: FormTypeModel }>()
);

export const addFormTypeFailure = createAction(
  '[FormType] Add Failure',
  props<{ error: string }>()
);

// UPDATE
export const updateFormType = createAction(
  '[FormType] Update',
  props<{ formType: FormTypeModel }>()
);

export const updateFormTypeSuccess = createAction(
  '[FormType] Update Success',
  props<{ formType: FormTypeModel }>()
);

export const updateFormTypeFailure = createAction(
  '[FormType] Update Failure',
  props<{ error: string }>()
);

// DELETE
export const deleteFormType = createAction(
  '[FormType] Delete',
  props<{ id: string }>()
);

export const deleteFormTypeSuccess = createAction(
  '[FormType] Delete Success',
  props<{ id: string }>()
);

export const deleteFormTypeFailure = createAction(
  '[FormType] Delete Failure',
  props<{ error: string }>()
);
