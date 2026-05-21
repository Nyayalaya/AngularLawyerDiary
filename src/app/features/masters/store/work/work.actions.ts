import { createAction, props } from '@ngrx/store';
import { Work } from '../../models/work.model';

export const loadWorks = createAction(
  '[Work] Load',
  props<{ pageNumber?: number; pageSize?: number; force?: boolean }>()
);

export const loadWorksSuccess = createAction(
  '[Work] Load Success',
  props<{ works: Work[], 
    totalRecords: number, 
    pageNumber: number, 
    pageSize: number,
    totalPages: number }>()
);

export const loadWorksFailure = createAction(
  '[Work] Load Failure',
  props<{ error: string }>()
);

// ADD
export const addWork = createAction(
  '[Work] Add',
  props<{ work: Work }>()
);

export const addWorkSuccess = createAction(
  '[Work] Add Success',
  props<{ work: Work }>()
);

export const addWorkFailure = createAction(
  '[Work] Add Failure',
  props<{ error: string }>()
);

// UPDATE
export const updateWork = createAction(
  '[Work] Update',
  props<{ work: Work }>()
);

export const updateWorkSuccess = createAction(
  '[Work] Update Success',
  props<{ work: Work }>()
);

export const updateWorkFailure = createAction(
  '[Work] Update Failure',
  props<{ error: string }>()
);

// DELETE
export const deleteWork = createAction(
  '[Work] Delete',
  props<{ id: string }>()
);

export const deleteWorkSuccess = createAction(
  '[Work] Delete Success',
  props<{ id: string }>()
);

export const deleteWorkFailure = createAction(
  '[Work] Delete Failure',
  props<{ error: string }>()
);
