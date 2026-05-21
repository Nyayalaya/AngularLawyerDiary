import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FormTemplateState } from './form-template.state';

export const selectFormTemplateMasterState =
  createFeatureSelector<FormTemplateState>('formTemplate');

export const selectAll           = createSelector(selectFormTemplateMasterState, s => s?.items          ?? []);
export const selectLoading       = createSelector(selectFormTemplateMasterState, s => s?.loading        ?? false);
export const selectError         = createSelector(selectFormTemplateMasterState, s => s?.error          ?? null);
export const selectTotalRecords  = createSelector(selectFormTemplateMasterState, s => s?.totalRecords   ?? 0);
export const selectPageNumber    = createSelector(selectFormTemplateMasterState, s => s?.pageNumber     ?? 1);
export const selectPageSize      = createSelector(selectFormTemplateMasterState, s => s?.pageSize       ?? 10);
export const selectTotalPages    = createSelector(selectFormTemplateMasterState, s => s?.totalPages     ?? 0);