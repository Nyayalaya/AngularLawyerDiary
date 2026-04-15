// store/case-stage/case-stage.state.ts

import { CaseStage } from '../../models/case-stage.model';

export interface CaseStageState {
  items: CaseStage[];
  selected: CaseStage | null;

  loading: boolean;
  loaded: boolean;
  error: string | null;
  lastFetched: number | null;

  totalRecords: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

export const initialCaseStageState: CaseStageState = {
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
