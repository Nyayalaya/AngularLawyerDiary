import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError, exhaustMap, filter,
  forkJoin, map, mergeMap, of,
  switchMap, tap, withLatestFrom,
} from 'rxjs';

import { CourtComplexActions } from './court-complex.actions';
import { CourtComplexService } from '../../services/court-complex.service';

import {
  selectCourtComplexPageNumber,
  selectCourtComplexPageSize,
  selectIsCourtComplexCacheStale,
} from './court-complex.selectors';

@Injectable()
export class CourtComplexEffects {

  private readonly actions$ = inject(Actions);
  private readonly store    = inject(Store);
  private readonly svc      = inject(CourtComplexService);

  // ── Load court complexes (with cache guard + pagination) ──────────────────
  loadCourtComplexes$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CourtComplexActions.loadCourtComplexes),
    withLatestFrom(this.store.select(selectIsCourtComplexCacheStale())),
    filter(([, stale]) => stale),
    switchMap(([{ pageNumber, pageSize }]) =>
      this.svc.getCourtComplexes(pageNumber, pageSize).pipe(
        map((res) => CourtComplexActions.loadCourtComplexesSuccess(res)),
        catchError((err) =>
          of(CourtComplexActions.loadCourtComplexesFailure({ error: err.message }))
        )
      )
    )
  )
);

  // ── Re-trigger load when page / size changes ─────────────────────────────
  reloadOnPageChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourtComplexActions.setPage, CourtComplexActions.setPageSize),
      withLatestFrom(
        this.store.select(selectCourtComplexPageNumber),
        this.store.select(selectCourtComplexPageSize),
      ),
      map(([, pageNumber, pageSize]) =>
        CourtComplexActions.loadCourtComplexes({ pageNumber, pageSize })
      )
    )
  );

  // ── Load single by ID ─────────────────────────────────────────────────────
  loadCourtComplexById$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CourtComplexActions.loadCourtComplexById),
    mergeMap(({ id }) =>
      this.svc.getById(id).pipe(
        map((courtComplex) => CourtComplexActions.loadCourtComplexByIdSuccess({ courtComplex })),
        catchError((err) =>
          of(CourtComplexActions.loadCourtComplexByIdFailure({ error: err.message }))
        )
      )
    )
  )
);

  // ── Create single ─────────────────────────────────────────────────────────
  createCourtComplex$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CourtComplexActions.createCourtComplex),
    exhaustMap(({ payload }) =>
      this.svc.createCourtComplex(payload).pipe(
        map((courtComplex) => CourtComplexActions.createCourtComplexSuccess({ courtComplex })),
        catchError((err) =>
          of(CourtComplexActions.createCourtComplexFailure({ error: err.message }))
        )
      )
    )
  )
);

  // ── Update ────────────────────────────────────────────────────────────────
  updateCourtComplex$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CourtComplexActions.updateCourtComplex),
    mergeMap(({ id, payload }) =>
      this.svc.updateCourtComplex(id, payload).pipe(
        map((courtComplex) => CourtComplexActions.updateCourtComplexSuccess({ courtComplex })),
        catchError((err) =>
          of(CourtComplexActions.updateCourtComplexFailure({ error: err.message }))
        )
      )
    )
  )
);

  // ── Delete single ─────────────────────────────────────────────────────────
  deleteCourtComplex$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CourtComplexActions.deleteCourtComplex),
    mergeMap(({ id }) =>
      this.svc.deleteCourtComplex(id).pipe(
        map(() => CourtComplexActions.deleteCourtComplexSuccess({ id })),
        catchError((err) =>
          of(CourtComplexActions.deleteCourtComplexFailure({ error: err.message }))
        )
      )
    )
  )
);

  // ── Create batch ──────────────────────────────────────────────────────────
  createCourtComplexesBatch$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CourtComplexActions.createCourtComplexesBatch),
    switchMap(({ payloads }) =>
      this.svc.createBatch(payloads).pipe(
        map((courtComplexes) => CourtComplexActions.createCourtComplexesBatchSuccess({ courtComplexes })),
        catchError((err) =>
          of(CourtComplexActions.createCourtComplexesBatchFailure({ error: err.message }))
        )
      )
    )
  )
);

  // ── Delete batch ──────────────────────────────────────────────────────────
  deleteCourtComplexesBatch$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CourtComplexActions.deleteCourtComplexesBatch),
    switchMap(({ ids }) =>
      this.svc.deleteBatch(ids).pipe(
        map((deletedIds) =>
          CourtComplexActions.deleteCourtComplexesBatchSuccess({ ids: deletedIds })
        ),
        catchError((err) =>
          of(CourtComplexActions.deleteCourtComplexesBatchFailure({ error: err.message }))
        )
      )
    )
  )
);
}
