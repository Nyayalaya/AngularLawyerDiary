// store/case-category/case-category.state.ts

import { CaseCategory } from '../../models/case-category.model';

export interface CaseCategoryState {
  items: CaseCategory[];
  selected: CaseCategory | null;

  loading: boolean;
  loaded: boolean;
  error: string | null;
  lastFetched: number | null;

  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const initialCaseCategoryState: CaseCategoryState = {
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
