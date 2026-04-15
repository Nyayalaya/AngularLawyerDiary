import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import * as A from './court-level.actions';
import * as S from './court-level.selectors';
import { CourtLevelService } from '../../services/court-level.service';

@Injectable()
export class CourtLevelEffects {

  private actions$ = inject(Actions);
  private store    = inject(Store);
  private service  = inject(CourtLevelService);

  private pageNumber$ = this.store.select(S.selectPageNumber);
  private pageSize$   = this.store.select(S.selectPageSize);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadCourtLevels),
      switchMap(action =>
        this.service.getAll(
          action.pageNumber ?? 1,
          action.pageSize ?? 10
        ).pipe(
          map(res => A.loadCourtLevelsSuccess({ 
            courtLevels: res.data,
            totalRecords: res.pagination.totalCount,
            pageNumber: res.pagination.pageNumber,
            pageSize: res.pagination.pageSize,
            totalPages: res.pagination.totalPages
          })),
          catchError(error =>
            of(A.loadCourtLevelsFailure({ error }))
          )
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addCourtLevel),
      mergeMap(action =>
        this.service.create(action.courtLevel).pipe(
          map(res => A.addCourtLevelSuccess({ courtLevel: res })),
          catchError(error =>
            of(A.addCourtLevelFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful add
  addSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addCourtLevelSuccess),
      map(() => A.loadCourtLevels({}))
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateCourtLevel),
      mergeMap(action =>
        this.service.update(action.courtLevel).pipe(
          map(res => A.updateCourtLevelSuccess({ courtLevel: res })),
          catchError(error =>
            of(A.updateCourtLevelFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful update
  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateCourtLevelSuccess),
      map(() => A.loadCourtLevels({}))
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteCourtLevel),
      mergeMap(action =>
        this.service.deleteById(action.id).pipe(
          map(() => A.deleteCourtLevelSuccess({ id: action.id })),
          catchError(error =>
            of(A.deleteCourtLevelFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful delete
  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteCourtLevelSuccess),
      withLatestFrom(this.pageNumber$, this.pageSize$),
      map(([, pageNumber, pageSize]) =>
        A.loadCourtLevels({
          pageNumber: pageNumber ?? 1,
          pageSize: pageSize ?? 10,
          force: true
        })
      )
    )
  );
}
