import { createAction, props } from '@ngrx/store';
import { CaseCategory } from '../../models/case-category.model';

export const loadCaseCategories = createAction(
  '[CaseCategory] Load',
  props<{ pageNumber?: number; pageSize?: number; force?: boolean }>()
);

export const loadCaseCategoriesSuccess = createAction(
  '[CaseCategory] Load Success',
  props<{ caseCategories: CaseCategory[], 
    totalRecords: number, 
    pageNumber: number, 
    pageSize: number,
    totalPages: number }>()
);

export const loadCaseCategoriesFailure = createAction(
  '[CaseCategory] Load Failure',
  props<{ error: string }>()
);

// ADD
export const addCaseCategory = createAction(
  '[CaseCategory] Add',
  props<{ caseCategory: CaseCategory }>()
);

export const addCaseCategorySuccess = createAction(
  '[CaseCategory] Add Success',
  props<{ caseCategory: CaseCategory }>()
);

export const addCaseCategoryFailure = createAction(
  '[CaseCategory] Add Failure',
  props<{ error: string }>()
);

// UPDATE
export const updateCaseCategory = createAction(
  '[CaseCategory] Update',
  props<{ caseCategory: CaseCategory }>()
);

export const updateCaseCategorySuccess = createAction(
  '[CaseCategory] Update Success',
  props<{ caseCategory: CaseCategory }>()
);

export const updateCaseCategoryFailure = createAction(
  '[CaseCategory] Update Failure',
  props<{ error: string }>()
);

// DELETE
export const deleteCaseCategory = createAction(
  '[CaseCategory] Delete',
  props<{ id: string }>()
);

export const deleteCaseCategorySuccess = createAction(
  '[CaseCategory] Delete Success',
  props<{ id: string }>()
);

export const deleteCaseCategoryFailure = createAction(
  '[CaseCategory] Delete Failure',
  props<{ error: string }>()
);
