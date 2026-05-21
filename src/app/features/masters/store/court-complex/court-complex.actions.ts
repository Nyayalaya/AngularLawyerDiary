import { createActionGroup, emptyProps, props } from '@ngrx/store';
import { CourtComplex } from '../../models/court-complex.model';
import { CreateCourtComplexDto, UpdateCourtComplexDto } from '../../dtos/court-complex.dto';
import { PaginatedResponse } from '../../../../core/models/pagination.model';

export const CourtComplexActions = createActionGroup({
  source: 'CourtComplex',
  events: {

    // ── Load / Query ──────────────────────────────────────────
    'Load Court Complexes': props<{ pageNumber: number; pageSize: number }>(),
    'Load Court Complexes Success': props<PaginatedResponse<CourtComplex>>(),
    'Load Court Complexes Failure': props<{ error: string }>(),

    'Load Court Complex By Id': props<{ id: string }>(),
    'Load Court Complex By Id Success': props<{ courtComplex: CourtComplex }>(),
    'Load Court Complex By Id Failure': props<{ error: string }>(),

    // ── Write — single ────────────────────────────────────────
    'Create Court Complex': props<{ payload: CreateCourtComplexDto }>(),
    'Create Court Complex Success': props<{ courtComplex: CourtComplex }>(),
    'Create Court Complex Failure': props<{ error: string }>(),

    'Update Court Complex': props<{ id: string; payload: UpdateCourtComplexDto }>(),
    'Update Court Complex Success': props<{ courtComplex: CourtComplex }>(),
    'Update Court Complex Failure': props<{ error: string }>(),

    'Delete Court Complex': props<{ id: string }>(),
    'Delete Court Complex Success': props<{ id: string }>(),
    'Delete Court Complex Failure': props<{ error: string }>(),

    // ── Write — batch ─────────────────────────────────────────
    'Create Court Complexes Batch': props<{ payloads: CreateCourtComplexDto[] }>(),
    'Create Court Complexes Batch Success': props<{ courtComplexes: CourtComplex[] }>(),
    'Create Court Complexes Batch Failure': props<{ error: string }>(),

    'Delete Court Complexes Batch': props<{ ids: string[] }>(),
    'Delete Court Complexes Batch Success': props<{ ids: string[] }>(),
    'Delete Court Complexes Batch Failure': props<{ error: string }>(),

    // ── Pagination ────────────────────────────────────────────
    'Set Page': props<{ pageNumber: number }>(),
    'Set Page Size': props<{ pageSize: number }>(),

    // ── Selection / UI ────────────────────────────────────────
    'Select Court Complex': props<{ id: string }>(),
    'Deselect Court Complex': props<{ id: string }>(),
    'Select All Court Complexes': emptyProps(),
    'Clear Selection': emptyProps(),
  }
});
