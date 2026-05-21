// store/court/court.reducer.ts
import { createReducer, on } from '@ngrx/store';
import { CourtActions } from './court.actions';
import { courtAdapter, initialCourtState } from './court.state';

export const courtReducer = createReducer(
  initialCourtState,

  // ── Load courts ─────────────────────────────────────────────
  on(CourtActions.loadCourts, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CourtActions.loadCourtsSuccess, (state, { items, totalRecords, totalPages, pageNumber, pageSize }) =>
    courtAdapter.setAll(items, {
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

  on(CourtActions.loadCourtsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Load single ──────────────────────────────────────────────
  on(CourtActions.loadCourtById, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(CourtActions.loadCourtByIdSuccess, (state, { court }) =>
    courtAdapter.upsertOne(court, { ...state, loading: false })
  ),

  on(CourtActions.loadCourtByIdFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // ── Create single ────────────────────────────────────────────
  on(CourtActions.createCourt, (state) => ({
    ...state,
    submitting: true,
    error: null,
  })),

  on(CourtActions.createCourtSuccess, (state, { court }) =>
    courtAdapter.addOne(court, {
      ...state,
      submitting: false,
      totalRecords: state.totalRecords + 1,
    })
  ),

  on(CourtActions.createCourtFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  // ── Update ───────────────────────────────────────────────────
  on(CourtActions.updateCourt, (state) => ({
    ...state,
    submitting: true,
    error: null,
  })),

  on(CourtActions.updateCourtSuccess, (state, { court }) =>
    courtAdapter.updateOne(
      { id: court.id, changes: court },
      { ...state, submitting: false }
    )
  ),

  on(CourtActions.updateCourtFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  // ── Delete single ────────────────────────────────────────────
  on(CourtActions.deleteCourt, (state) => ({
    ...state,
    submitting: true,
    error: null,
  })),

  on(CourtActions.deleteCourtSuccess, (state, { id }) =>
    courtAdapter.removeOne(id, {
      ...state,
      submitting: false,
      totalRecords: state.totalRecords - 1,
      selectedIds: state.selectedIds.filter((sid) => sid !== id),
    })
  ),

  on(CourtActions.deleteCourtFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  // ── Create batch ─────────────────────────────────────────────
  on(CourtActions.createCourtsBatch, (state) => ({
    ...state,
    submitting: true,
    error: null,
  })),

  on(CourtActions.createCourtsBatchSuccess, (state, { courts }) =>
    courtAdapter.addMany(courts, {
      ...state,
      submitting: false,
      totalRecords: state.totalRecords + courts.length,
    })
  ),

  on(CourtActions.createCourtsBatchFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  // ── Delete batch ─────────────────────────────────────────────
  on(CourtActions.deleteCourtsBatch, (state) => ({
    ...state,
    submitting: true,
    error: null,
  })),

  on(CourtActions.deleteCourtsBatchSuccess, (state, { ids }) =>
    courtAdapter.removeMany(ids, {
      ...state,
      submitting: false,
      totalRecords: state.totalRecords - ids.length,
      selectedIds: state.selectedIds.filter((sid) => !ids.includes(sid)),
    })
  ),

  on(CourtActions.deleteCourtsBatchFailure, (state, { error }) => ({
    ...state,
    submitting: false,
    error,
  })),

  // ── Pagination ───────────────────────────────────────────────
  on(CourtActions.setPage, (state, { pageNumber }) => ({
    ...state,
    pageNumber,
  })),

  on(CourtActions.setPageSize, (state, { pageSize }) => ({
    ...state,
    pageSize,
    pageNumber: 1, // reset to first page whenever page size changes
  })),

  // ── Selection ────────────────────────────────────────────────
  on(CourtActions.selectCourt, (state, { id }) => ({
    ...state,
    selectedIds: state.selectedIds.includes(id)
      ? state.selectedIds
      : [...state.selectedIds, id],
  })),

  on(CourtActions.deselectCourt, (state, { id }) => ({
    ...state,
    selectedIds: state.selectedIds.filter((sid) => sid !== id),
  })),

  on(CourtActions.selectAllCourts, (state) => ({
    ...state,
    selectedIds: state.ids as string[],
  })),

  on(CourtActions.clearSelection, (state) => ({
    ...state,
    selectedIds: [],
  })),

  // ── UI resets ────────────────────────────────────────────────
  on(CourtActions.clearError, (state) => ({
    ...state,
    error: null,
  })),

  on(CourtActions.resetCourtState, () => initialCourtState),
);