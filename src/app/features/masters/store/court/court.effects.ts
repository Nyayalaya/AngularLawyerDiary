// store/court/court.effects.ts
import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import {
  catchError, exhaustMap, filter,
  forkJoin, map, mergeMap, of,
  switchMap, tap, withLatestFrom,
} from 'rxjs';

import { CourtActions } from './court.actions';
import { CourtService } from '../../services/court.service';

import {
  selectCourtPageNumber,
  selectCourtPageSize,
  selectIsCacheStale,
} from './court.selectors';

@Injectable()
export class CourtEffects {

  private readonly actions$ = inject(Actions);
  private readonly store    = inject(Store);
  private readonly svc      = inject(CourtService);

  // ── Load courts (with cache guard + pagination) ──────────────────────────
  loadCourts$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CourtActions.loadCourts),
    withLatestFrom(this.store.select(selectIsCacheStale())),
    filter(([, stale]) => stale),
    switchMap(([{ pageNumber, pageSize }]) =>
      this.svc.getCourts(pageNumber, pageSize).pipe(   // ← getCourts()
        map((res) => CourtActions.loadCourtsSuccess(res)),
        catchError((err) =>
          of(CourtActions.loadCourtsFailure({ error: err.message }))
        )
      )
    )
  )
);

  // ── Re-trigger load when page / size changes ─────────────────────────────
  reloadOnPageChange$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CourtActions.setPage, CourtActions.setPageSize),
      withLatestFrom(
        this.store.select(selectCourtPageNumber),
        this.store.select(selectCourtPageSize),
      ),
      map(([, pageNumber, pageSize]) =>
        CourtActions.loadCourts({ pageNumber, pageSize })
      )
    )
  );

  // ── Load single by ID ─────────────────────────────────────────────────────
  loadCourtById$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CourtActions.loadCourtById),
    mergeMap(({ id }) =>
      this.svc.getById(id).pipe(                       // ← inherited getById()
        map((court) => CourtActions.loadCourtByIdSuccess({ court })),
        catchError((err) =>
          of(CourtActions.loadCourtByIdFailure({ error: err.message }))
        )
      )
    )
  )
);

  // ── Create single ─────────────────────────────────────────────────────────
  createCourt$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CourtActions.createCourt),
    exhaustMap(({ payload }) =>
      this.svc.createCourt(payload).pipe(              // ← createCourt()
        map((court) => CourtActions.createCourtSuccess({ court })),
        catchError((err) =>
          of(CourtActions.createCourtFailure({ error: err.message }))
        )
      )
    )
  )
);

  // ── Update ────────────────────────────────────────────────────────────────
  updateCourt$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CourtActions.updateCourt),
    mergeMap(({ id, payload }) =>
      this.svc.updateCourt(id, payload).pipe(          // ← updateCourt()
        map((court) => CourtActions.updateCourtSuccess({ court })),
        catchError((err) =>
          of(CourtActions.updateCourtFailure({ error: err.message }))
        )
      )
    )
  )
);

  // ── Delete single ─────────────────────────────────────────────────────────
  deleteCourt$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CourtActions.deleteCourt),
    mergeMap(({ id }) =>
      this.svc.deleteCourt(id).pipe(                   // ← deleteCourt()
        map(() => CourtActions.deleteCourtSuccess({ id })),
        catchError((err) =>
          of(CourtActions.deleteCourtFailure({ error: err.message }))
        )
      )
    )
  )
);

  // ── Create batch ──────────────────────────────────────────────────────────
  createCourtsBatch$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CourtActions.createCourtsBatch),
    switchMap(({ payloads }) =>
      this.svc.createBatch(payloads).pipe(             // ← createBatch()
        map((courts) => CourtActions.createCourtsBatchSuccess({ courts })),
        catchError((err) =>
          of(CourtActions.createCourtsBatchFailure({ error: err.message }))
        )
      )
    )
  )
);

  // ── Delete batch ──────────────────────────────────────────────────────────
  deleteCourtsBatch$ = createEffect(() =>
  this.actions$.pipe(
    ofType(CourtActions.deleteCourtsBatch),
    switchMap(({ ids }) =>
      this.svc.deleteBatch(ids).pipe(                  // ← deleteBatch()
        map((deletedIds) =>
          CourtActions.deleteCourtsBatchSuccess({ ids: deletedIds })
        ),
        catchError((err) =>
          of(CourtActions.deleteCourtsBatchFailure({ error: err.message }))
        )
      )
    )
  )
);

  // ── Toast notifications (no dispatch) ────────────────────────────────────
  // notifySuccess$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(
  //         CourtActions.createCourtSuccess,
  //         CourtActions.updateCourtSuccess,
  //         CourtActions.deleteCourtSuccess,
  //       ),
  //       tap(({ type }) => {
  //         const msg: Record<string, string> = {
  //           '[Court] Create Court Success': 'Court created successfully.',
  //           '[Court] Update Court Success': 'Court updated successfully.',
  //           '[Court] Delete Court Success': 'Court deleted successfully.',
  //         };
  //         this.toast.success(msg[type] ?? 'Done.');
  //       })
  //     ),
  //   { dispatch: false }
  // );

  // notifyBatchSuccess$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(
  //         CourtActions.createCourtsBatchSuccess,
  //         CourtActions.deleteCourtsBatchSuccess,
  //       ),
  //       tap((action) => {
  //         if ('courts' in action) {
  //           this.toast.success(`${action.courts.length} courts created.`);
  //         } else if ('ids' in action) {
  //           this.toast.success(`${action.ids.length} courts deleted.`);
  //         }
  //       })
  //     ),
  //   { dispatch: false }
  // );

  // notifyFailure$ = createEffect(
  //   () =>
  //     this.actions$.pipe(
  //       ofType(
  //         CourtActions.loadCourtsFailure,
  //         CourtActions.createCourtFailure,
  //         CourtActions.updateCourtFailure,
  //         CourtActions.deleteCourtFailure,
  //         CourtActions.createCourtsBatchFailure,
  //         CourtActions.deleteCourtsBatchFailure,
  //       ),
  //       tap(({ error }) => this.toast.error(error))
  //     ),
  //   { dispatch: false }
  // );
}