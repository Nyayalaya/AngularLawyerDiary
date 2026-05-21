import { createReducer, on } from '@ngrx/store';
import { CourtComplexActions } from './court-complex.actions';
import { courtComplexAdapter, initialCourtComplexState } from './court-complex.state';

export const courtComplexReducer = createReducer(
  initialCourtComplexState,

  // ── Load court complexes ──────────────────────────────────────────
  on(CourtComplexActions.loadCourtComplexes, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CourtComplexActions.loadCourtComplexesSuccess, (state, { items, totalRecords, totalPages, pageNumber, pageSize }) =>
    courtComplexAdapter.setAll(items, {
      ...state,
      loading: false,
      loaded: true,
      lastFetched: Date.now(),
      totalRecords,
      totalPages,
      pageNumber,
      pageSize,
    })
  ),

  on(CourtComplexActions.loadCourtComplexesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Load single ──────────────────────────────────────────────
  on(CourtComplexActions.loadCourtComplexById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CourtComplexActions.loadCourtComplexByIdSuccess, (state, { courtComplex }) =>
    courtComplexAdapter.upsertOne(courtComplex, { ...state, loading: false })
  ),

  on(CourtComplexActions.loadCourtComplexByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Create single ────────────────────────────────────────────
  on(CourtComplexActions.createCourtComplex, (state) => ({
    ...state,
    submitting: true,
    error: null,
  })),

  on(CourtComplexActions.createCourtComplexSuccess, (state, { courtComplex }) =>
    courtComplexAdapter.addOne(courtComplex, {
      ...state,
      submitting: false,
      totalRecords: state.totalRecords + 1,
    })
  ),

  on(CourtComplexActions.createCourtComplexFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  // ── Update ───────────────────────────────────────────────────
  on(CourtComplexActions.updateCourtComplex, (state) => ({
    ...state,
    submitting: true,
    error: null,
  })),

  on(CourtComplexActions.updateCourtComplexSuccess, (state, { courtComplex }) =>
    courtComplexAdapter.updateOne(
      { id: courtComplex.id, changes: courtComplex },
      { ...state, submitting: false }
    )
  ),

  on(CourtComplexActions.updateCourtComplexFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  // ── Delete single ────────────────────────────────────────────
  on(CourtComplexActions.deleteCourtComplex, (state) => ({
    ...state,
    submitting: true,
    error: null,
  })),

  on(CourtComplexActions.deleteCourtComplexSuccess, (state, { id }) =>
    courtComplexAdapter.removeOne(id, {
      ...state,
      submitting: false,
      totalRecords: state.totalRecords - 1,
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    })
  ),

  on(CourtComplexActions.deleteCourtComplexFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  // ── Create batch ─────────────────────────────────────────────
  on(CourtComplexActions.createCourtComplexesBatch, (state) => ({
    ...state,
    submitting: true,
    error: null,
  })),

  on(CourtComplexActions.createCourtComplexesBatchSuccess, (state, { courtComplexes }) =>
    courtComplexAdapter.addMany(courtComplexes, {
      ...state,
      submitting: false,
      totalRecords: state.totalRecords + courtComplexes.length,
    })
  ),

  on(CourtComplexActions.createCourtComplexesBatchFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  // ── Delete batch ─────────────────────────────────────────────
  on(CourtComplexActions.deleteCourtComplexesBatch, (state) => ({
    ...state,
    submitting: true,
    error: null,
  })),

  on(CourtComplexActions.deleteCourtComplexesBatchSuccess, (state, { ids }) =>
    courtComplexAdapter.removeMany(ids, {
      ...state,
      submitting: false,
      totalRecords: state.totalRecords - ids.length,
      selectedIds: state.selectedIds.filter((sid) => !ids.includes(sid)),
    })
  ),

  on(CourtComplexActions.deleteCourtComplexesBatchFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  // ── Pagination ───────────────────────────────────────────────
  on(CourtComplexActions.setPage, (state, { pageNumber }) => ({
    ...state,
    pageNumber,
  })),

  on(CourtComplexActions.setPageSize, (state, { pageSize }) => ({
    ...state,
    pageSize,
    pageNumber: 1,
  })),

  // ── Selection ────────────────────────────────────────────────
  on(CourtComplexActions.selectCourtComplex, (state, { id }) => ({
    ...state,
    selectedIds: state.selectedIds.includes(id)
      ? state.selectedIds
      : [...state.selectedIds, id],
  })),

  on(CourtComplexActions.deselectCourtComplex, (state, { id }) => ({
    ...state,
    selectedIds: state.selectedIds.filter((sid) => sid !== id),
  })),

  on(CourtComplexActions.selectAllCourtComplexes, (state) => ({
    ...state,
    selectedIds: state.ids as string[],
  })),

  on(CourtComplexActions.clearSelection, (state) => ({
    ...state,
    selectedIds: [],
  })),
);
