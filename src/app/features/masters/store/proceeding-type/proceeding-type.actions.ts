import { createAction, props } from '@ngrx/store';
import { ProceedingType } from '../../models/proceeding-type.model';

export const loadProceedingTypes = createAction(
  '[ProceedingType] Load',
  props<{ pageNumber?: number; pageSize?: number; force?: boolean }>()
);

export const loadProceedingTypesSuccess = createAction(
  '[ProceedingType] Load Success',
  props<{ proceedingTypes: ProceedingType[], 
    totalRecords: number, 
    pageNumber: number, 
    pageSize: number,
    totalPages: number }>()
);

export const loadProceedingTypesFailure = createAction(
  '[ProceedingType] Load Failure',
  props<{ error: string }>()
);

// ADD
export const addProceedingType = createAction(
  '[ProceedingType] Add',
  props<{ proceedingType: ProceedingType }>()
);

export const addProceedingTypeSuccess = createAction(
  '[ProceedingType] Add Success',
  props<{ proceedingType: ProceedingType }>()
);

export const addProceedingTypeFailure = createAction(
  '[ProceedingType] Add Failure',
  props<{ error: string }>()
);

// UPDATE
export const updateProceedingType = createAction(
  '[ProceedingType] Update',
  props<{ proceedingType: ProceedingType }>()
);

export const updateProceedingTypeSuccess = createAction(
  '[ProceedingType] Update Success',
  props<{ proceedingType: ProceedingType }>()
);

export const updateProceedingTypeFailure = createAction(
  '[ProceedingType] Update Failure',
  props<{ error: string }>()
);

// DELETE
export const deleteProceedingType = createAction(
  '[ProceedingType] Delete',
  props<{ id: string }>()
);

export const deleteProceedingTypeSuccess = createAction(
  '[ProceedingType] Delete Success',
  props<{ id: string }>()
);

export const deleteProceedingTypeFailure = createAction(
  '[ProceedingType] Delete Failure',
  props<{ error: string }>()
);
