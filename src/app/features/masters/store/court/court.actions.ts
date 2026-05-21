// store/court/court.actions.ts
import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { Court } from '../../models/court.model';
import { CreateCourtDto,UpdateCourtDto } from '../../dtos/court.dto';
import { PaginatedResponse } from '../../../../core/models/pagination.model';

export const CourtActions = createActionGroup({
  source: 'Court',
  events: {

    // ── Load / Query ──────────────────────────────────────────
    'Load Courts': props<{ pageNumber: number; pageSize: number }>(),
    'Load Courts Success': props<PaginatedResponse<Court>>(),
    'Load Courts Failure': props<{ error: string }>(),

    'Load Court By Id': props<{ id: string }>(),
    'Load Court By Id Success': props<{ court: Court }>(),
    'Load Court By Id Failure': props<{ error: string }>(),

    // ── Write — single ────────────────────────────────────────
    'Create Court': props<{ payload: CreateCourtDto }>(),
    'Create Court Success': props<{ court: Court }>(),
    'Create Court Failure': props<{ error: string }>(),

    'Update Court': props<{ id: string; payload: UpdateCourtDto }>(),
    'Update Court Success': props<{ court: Court }>(),
    'Update Court Failure': props<{ error: string }>(),

    'Delete Court': props<{ id: string }>(),
    'Delete Court Success': props<{ id: string }>(),
    'Delete Court Failure': props<{ error: string }>(),

    // ── Write — batch ─────────────────────────────────────────
    'Create Courts Batch': props<{ payloads: CreateCourtDto[] }>(),
    'Create Courts Batch Success': props<{ courts: Court[] }>(),
    'Create Courts Batch Failure': props<{ error: string }>(),

    'Delete Courts Batch': props<{ ids: string[] }>(),
    'Delete Courts Batch Success': props<{ ids: string[] }>(),
    'Delete Courts Batch Failure': props<{ error: string }>(),

    // ── Pagination ────────────────────────────────────────────
    'Set Page': props<{ pageNumber: number }>(),
    'Set Page Size': props<{ pageSize: number }>(),

    // ── Selection / UI ────────────────────────────────────────
    'Select Court': props<{ id: string }>(),
    'Deselect Court': props<{ id: string }>(),
    'Select All Courts': emptyProps(),
    'Clear Selection': emptyProps(),
    'Clear Error': emptyProps(),
    'Reset Court State': emptyProps(),
  },
});