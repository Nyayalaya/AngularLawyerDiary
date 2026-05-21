// store/form-subtype/form-subtype.state.ts

import { FormSubTypeModel } from '../../models/form-sub-type-model';

export interface FormSubTypeState {
  items: FormSubTypeModel[];
  selected: FormSubTypeModel | null;

  loading: boolean;
  loaded: boolean;
  error: string | null;
  lastFetched: number | null;

  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const initialFormSubTypeState: FormSubTypeState = {
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
