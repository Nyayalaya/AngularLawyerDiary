// store/cadre/cadre.state.ts

import { Cadre } from '../../models/cadre.model';

export interface CadreState {
  items: Cadre[];
  selected: Cadre | null;

  loading: boolean;
  loaded: boolean;
  error: string | null;
  lastFetched: number | null;

  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const initialCadreState: CadreState = {
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
