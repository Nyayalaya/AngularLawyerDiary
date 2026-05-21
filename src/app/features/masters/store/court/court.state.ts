import { Court } from "../../models/court.model";
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

export interface CourtState extends EntityState<Court> {
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

export const courtAdapter: EntityAdapter<Court> = createEntityAdapter<Court>({
    selectId: (c) => c.id,
    sortComparer: (a, b) => a.name.localeCompare(b.name),
});

export const initialCourtState: CourtState = courtAdapter.getInitialState({
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