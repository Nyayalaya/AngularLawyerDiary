// court-type-state.ts
import { CourtTypeModel } from '../../models/court-type.model';

export interface CourtTypeState {
  items: CourtTypeModel[];
  loading: boolean;
  loaded: boolean;
  error: string | null;
  lastFetched: number | null;
  totalRecords: number;     // ← add
  pageNumber: number;       // ← add
  pageSize: number;         // ← add
  totalPages: number;       // ← add
}

export const initialCourtTypeState: CourtTypeState = {
  items: [],
  loading: false,
  loaded: false,
  error: null,
  lastFetched: null,
  totalRecords: 0,          // ← add
  pageNumber: 1,            // ← add
  pageSize: 10,             // ← add
  totalPages: 0             // ← add
};