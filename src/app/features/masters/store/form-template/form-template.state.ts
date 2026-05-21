// store/form-template/form-template.state.ts

import { FormTemplateModel } from '../../models/form-template.model';

export interface FormTemplateState {
  items: FormTemplateModel[];
  selected: FormTemplateModel | null;

  loading: boolean;
  loaded: boolean;
  error: string | null;
  lastFetched: number | null;

  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const initialFormTemplateState: FormTemplateState = {
  items: [],
  selected: null,

  loading: false,
  loaded: false,
  error: null,
  lastFetched: null,

  totalRecords: 0,
  pageNumber: 1,
  pageSize: 10,
  totalPages: 0
};