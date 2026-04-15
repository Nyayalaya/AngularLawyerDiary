// store/court-level/court-level.state.ts

import { CourtLevel } from '../../models/court-level.model';

export interface CourtLevelState {
  items: CourtLevel[];
  selected: CourtLevel | null;

  loading: boolean;
  loaded: boolean;
  error: string | null;
  lastFetched: number | null;

  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const initialCourtLevelState: CourtLevelState = {
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
