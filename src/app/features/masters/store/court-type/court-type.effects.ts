import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import * as A from './court-type.actions';
import * as S from './court-type.selectors';
import { CourtTypeService } from '../../services/court-type.service';

@Injectable()
export class CourtTypeEffects {

  private actions$ = inject(Actions);
  private store    = inject(Store);
  private service  = inject(CourtTypeService);

  private pageNumber$ = this.store.select(S.selectPageNumber);
  private pageSize$   = this.store.select(S.selectPageSize);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadCourtTypes),
      switchMap(action =>
        this.service.getAll(
          action.pageNumber ?? 1,
          action.pageSize ?? 10
        ).pipe(
          map(res => A.loadCourtTypesSuccess({ 
            courtTypes: res.data,
            totalRecords: res.pagination.totalCount,
            pageNumber: res.pagination.pageNumber,
            pageSize: res.pagination.pageSize,
            totalPages: res.pagination.totalPages
          })),
          catchError(error =>
            of(A.loadCourtTypesFailure({ error }))
          )
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addCourtType),
      mergeMap(action =>
        this.service.create(action.courtType).pipe(
          map(res => A.addCourtTypeSuccess({ courtType: res })),
          catchError(error =>
            of(A.addCourtTypeFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful add
  addSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addCourtTypeSuccess),
      map(() => A.loadCourtTypes({}))
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateCourtType),
      mergeMap(action =>
        this.service.update(action.courtType).pipe(
          map(res => A.updateCourtTypeSuccess({ courtType: res })),
          catchError(error =>
            of(A.updateCourtTypeFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful update
  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateCourtTypeSuccess),
      map(() => A.loadCourtTypes({}))
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteCourtType),
      mergeMap(action =>
        this.service.deleteById(action.id).pipe(
          map(() => A.deleteCourtTypeSuccess({ id: action.id })),
          catchError(error =>
            of(A.deleteCourtTypeFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful delete
  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteCourtTypeSuccess),
      withLatestFrom(this.pageNumber$, this.pageSize$),
      map(([, pageNumber, pageSize]) =>
        A.loadCourtTypes({
          pageNumber: pageNumber ?? 1,
          pageSize: pageSize ?? 10,
          force: true
        })
      )
    )
  );
}