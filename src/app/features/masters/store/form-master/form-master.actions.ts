import { createAction, props } from '@ngrx/store';
import { FormMasterModel } from '../../models/form-master.model';

export const loadFormMasters = createAction(
  '[FormMaster] Load',
  props<{ pageNumber?: number; pageSize?: number; force?: boolean }>()
);

export const loadFormMastersSuccess = createAction(
  '[FormMaster] Load Success',
  props<{ formMasters: FormMasterModel[], 
    totalRecords: number, 
    pageNumber: number, 
    pageSize: number,
    totalPages: number }>()
);

export const loadFormMastersFailure = createAction(
  '[FormMaster] Load Failure',
  props<{ error: string }>()
);

// ADD
export const addFormMaster = createAction(
  '[FormMaster] Add',
  props<{ formMaster: FormMasterModel }>()
);

export const addFormMasterSuccess = createAction(
  '[FormMaster] Add Success',
  props<{ formMaster: FormMasterModel }>()
);

export const addFormMasterFailure = createAction(
  '[FormMaster] Add Failure',
  props<{ error: string }>()
);

// UPDATE
export const updateFormMaster = createAction(
  '[FormMaster] Update',
  props<{ formMaster: FormMasterModel }>()
);

export const updateFormMasterSuccess = createAction(
  '[FormMaster] Update Success',
  props<{ formMaster: FormMasterModel }>()
);

export const updateFormMasterFailure = createAction(
  '[FormMaster] Update Failure',
  props<{ error: string }>()
);

// DELETE
export const deleteFormMaster = createAction(
  '[FormMaster] Delete',
  props<{ id: string }>()
);

export const deleteFormMasterSuccess = createAction(
  '[FormMaster] Delete Success',
  props<{ id: string }>()
);

export const deleteFormMasterFailure = createAction(
  '[FormMaster] Delete Failure',
  props<{ error: string }>()
);
