import { createAction, props } from '@ngrx/store';
import { CaseStage } from '../../models/case-stage.model';

export const loadCaseStages = createAction(
  '[CaseStage] Load',
  props<{ pageNumber?: number; pageSize?: number; force?: boolean }>()
);

export const loadCaseStagesSuccess = createAction(
  '[CaseStage] Load Success',
  props<{ caseStages: CaseStage[], 
    totalRecords: number, 
    pageNumber: number, 
    pageSize: number,
    totalPages: number }>()
);

export const loadCaseStagesFailure = createAction(
  '[CaseStage] Load Failure',
  props<{ error: string }>()
);

// ADD
export const addCaseStage = createAction(
  '[CaseStage] Add',
  props<{ caseStage: CaseStage }>()
);

export const addCaseStageSuccess = createAction(
  '[CaseStage] Add Success',
  props<{ caseStage: CaseStage }>()
);

export const addCaseStageFailure = createAction(
  '[CaseStage] Add Failure',
  props<{ error: string }>()
);

// UPDATE
export const updateCaseStage = createAction(
  '[CaseStage] Update',
  props<{ caseStage: CaseStage }>()
);

export const updateCaseStageSuccess = createAction(
  '[CaseStage] Update Success',
  props<{ caseStage: CaseStage }>()
);

export const updateCaseStageFailure = createAction(
  '[CaseStage] Update Failure',
  props<{ error: string }>()
);

// DELETE
export const deleteCaseStage = createAction(
  '[CaseStage] Delete',
  props<{ id: string }>()
);

export const deleteCaseStageSuccess = createAction(
  '[CaseStage] Delete Success',
  props<{ id: string }>()
);

export const deleteCaseStageFailure = createAction(
  '[CaseStage] Delete Failure',
  props<{ error: string }>()
);
