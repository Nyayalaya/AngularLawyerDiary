// store/state/state.actions.ts

import { createAction, props } from '@ngrx/store';
import { StateModel } from '../../models/state.model';

export const loadStates = createAction(
  '[State] Load States',
  props<{ pageNumber: number; pageSize: number;force?: boolean }>()
);

export const loadStatesSuccess = createAction(
  '[State] Load States Success',
  props<{
    items: StateModel[];
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
  }>()
);

export const loadStatesFailure = createAction(
  '[State] Load States Failure',
  props<{ error: string }>()
);

// 👉 Get By Id (View Page)
export const loadStateById = createAction(
  '[State] Load By Id',
  props<{ id: number }>()
);

export const loadStateByIdSuccess = createAction(
  '[State] Load By Id Success',
  props<{ state: StateModel }>()
);

export const loadStateByIdFailure = createAction(
  '[State] Load By Id Failure',
  props<{ error: string }>()
);
