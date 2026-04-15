// store/court-district/court-district.state.ts

import { CourtDistrict } from '../../models/court-district.model';

export interface CourtDistrictState {
  items: CourtDistrict[];
  selected: CourtDistrict | null;

  loading: boolean;
  loaded: boolean;
  error: string | null;
  lastFetched: number | null;

  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const initialCourtDistrictState: CourtDistrictState = {
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
