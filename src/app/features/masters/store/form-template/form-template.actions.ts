import { createAction, props } from '@ngrx/store';
import { FormTemplateModel } from '../../models/form-template.model';

export const loadFormTemplates = createAction(
  '[FormTemplate] Load',
  props<{ pageNumber?: number; pageSize?: number; force?: boolean }>()
);

export const loadFormTemplatesSuccess = createAction(
  '[FormTemplate] Load Success',
  props<{ formTemplates: FormTemplateModel[], 
    totalRecords: number, 
    pageNumber: number, 
    pageSize: number,
    totalPages: number }>()
);

export const loadFormTemplatesFailure = createAction(
  '[FormTemplate] Load Failure',
  props<{ error: string }>()
);

// ADD
export const addFormTemplate = createAction(
  '[FormTemplate] Add',
  props<{ formTemplate: FormTemplateModel }>()
);

export const addFormTemplateSuccess = createAction(
  '[FormTemplate] Add Success',
  props<{ formTemplate: FormTemplateModel }>()
);

export const addFormTemplateFailure = createAction(
  '[FormTemplate] Add Failure',
  props<{ error: string }>()
);

// UPDATE
export const updateFormTemplate = createAction(
  '[FormTemplate] Update',
  props<{ formTemplate: FormTemplateModel }>()
);

export const updateFormTemplateSuccess = createAction(
  '[FormTemplate] Update Success',
  props<{ formTemplate: FormTemplateModel }>()
);

export const updateFormTemplateFailure = createAction(
  '[FormTemplate] Update Failure',
  props<{ error: string }>()
);

// DELETE
export const deleteFormTemplate = createAction(
  '[FormTemplate] Delete',
  props<{ id: string }>()
);

export const deleteFormTemplateSuccess = createAction(
  '[FormTemplate] Delete Success',
  props<{ id: string }>()
);

export const deleteFormTemplateFailure = createAction(
  '[FormTemplate] Delete Failure',
  props<{ error: string }>()
);