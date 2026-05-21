import { CourtComplex } from "../../models/court-complex.model";
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface CourtComplexState extends EntityState<CourtComplex> {
    selectedIds: string[];
    loading: boolean;
    submitting: boolean;
    loaded: boolean;
    error: string | null;
    lastFetched: number | null;
    totalRecords: number;
    pageNumber: number;
    pageSize: number;
    totalPages: number;
}

export const courtComplexAdapter: EntityAdapter<CourtComplex> = createEntityAdapter<CourtComplex>({
    selectId: (c) => c.id,
    sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const initialCourtComplexState: CourtComplexState = courtComplexAdapter.getInitialState({
    selectedIds: [],

    loading: false,
    submitting: false,
    loaded: false,
    error: null,

    lastFetched: null,

    totalRecords: 0,
    pageNumber: 1,
    pageSize: 10,
    totalPages: 0,
});
