import { createAction, props } from '@ngrx/store';
import { Proceeding } from '../../models/proceeding.model';

export const loadProceedings = createAction(
  '[Proceeding] Load',
  props<{ pageNumber?: number; pageSize?: number; force?: boolean }>()
);

export const loadProceedingsSuccess = createAction(
  '[Proceeding] Load Success',
  props<{ proceedings: Proceeding[], 
    totalRecords: number, 
    pageNumber: number, 
    pageSize: number,
    totalPages: number }>()
);

export const loadProceedingsFailure = createAction(
  '[Proceeding] Load Failure',
  props<{ error: string }>()
);

// ADD
export const addProceeding = createAction(
  '[Proceeding] Add',
  props<{ proceeding: Proceeding }>()
);

export const addProceedingSuccess = createAction(
  '[Proceeding] Add Success',
  props<{ proceeding: Proceeding }>()
);

export const addProceedingFailure = createAction(
  '[Proceeding] Add Failure',
  props<{ error: string }>()
);

// UPDATE
export const updateProceeding = createAction(
  '[Proceeding] Update',
  props<{ proceeding: Proceeding }>()
);

export const updateProceedingSuccess = createAction(
  '[Proceeding] Update Success',
  props<{ proceeding: Proceeding }>()
);

export const updateProceedingFailure = createAction(
  '[Proceeding] Update Failure',
  props<{ error: string }>()
);

// DELETE
export const deleteProceeding = createAction(
  '[Proceeding] Delete',
  props<{ id: string }>()
);

export const deleteProceedingSuccess = createAction(
  '[Proceeding] Delete Success',
  props<{ id: string }>()
);

export const deleteProceedingFailure = createAction(
  '[Proceeding] Delete Failure',
  props<{ error: string }>()
);
