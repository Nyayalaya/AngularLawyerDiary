import { createAction, props } from '@ngrx/store';
import { Cadre } from '../../models/cadre.model';

export const loadCadres = createAction(
  '[Cadre] Load',
  props<{ pageNumber?: number; pageSize?: number; force?: boolean }>()
);

export const loadCadresSuccess = createAction(
  '[Cadre] Load Success',
  props<{ cadres: Cadre[], 
    totalRecords: number, 
    pageNumber: number, 
    pageSize: number,
    totalPages: number }>()
);

export const loadCadresFailure = createAction(
  '[Cadre] Load Failure',
  props<{ error: string }>()
);

// ADD
export const addCadre = createAction(
  '[Cadre] Add',
  props<{ cadre: Cadre }>()
);

export const addCadreSuccess = createAction(
  '[Cadre] Add Success',
  props<{ cadre: Cadre }>()
);

export const addCadreFailure = createAction(
  '[Cadre] Add Failure',
  props<{ error: string }>()
);

// UPDATE
export const updateCadre = createAction(
  '[Cadre] Update',
  props<{ cadre: Cadre }>()
);

export const updateCadreSuccess = createAction(
  '[Cadre] Update Success',
  props<{ cadre: Cadre }>()
);

export const updateCadreFailure = createAction(
  '[Cadre] Update Failure',
  props<{ error: string }>()
);

// DELETE
export const deleteCadre = createAction(
  '[Cadre] Delete',
  props<{ id: string }>()
);

export const deleteCadreSuccess = createAction(
  '[Cadre] Delete Success',
  props<{ id: string }>()
);

export const deleteCadreFailure = createAction(
  '[Cadre] Delete Failure',
  props<{ error: string }>()
);
