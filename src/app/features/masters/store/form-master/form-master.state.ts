// store/form-master/form-master.state.ts

import { FormMasterModel } from '../../models/form-master.model';

export interface FormMasterState {
  items: FormMasterModel[];
  selected: FormMasterModel | null;

  loading: boolean;
  loaded: boolean;
  error: string | null;
  lastFetched: number | null;

  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const initialFormMasterState: FormMasterState = {
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
