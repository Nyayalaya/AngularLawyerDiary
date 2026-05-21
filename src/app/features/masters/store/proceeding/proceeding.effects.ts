import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import * as A from './proceeding.actions';
import * as S from './proceeding.selectors';
import { ProceedingService } from '../../services/proceeding.service';

@Injectable()
export class ProceedingEffects {

  private actions$ = inject(Actions);
  private store    = inject(Store);
  private service  = inject(ProceedingService);

  private pageNumber$ = this.store.select(S.selectPageNumber);
  private pageSize$   = this.store.select(S.selectPageSize);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadProceedings),
      switchMap(action =>
        this.service.getAll(
          action.pageNumber ?? 1,
          action.pageSize ?? 10
        ).pipe(
          map(res => A.loadProceedingsSuccess({ 
            proceedings: res.data,
            totalRecords: res.pagination.totalCount,
            pageNumber: res.pagination.pageNumber,
            pageSize: res.pagination.pageSize,
            totalPages: res.pagination.totalPages
          })),
          catchError(error =>
            of(A.loadProceedingsFailure({ error }))
          )
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addProceeding),
      mergeMap(action =>
        this.service.create(action.proceeding).pipe(
          map(res => A.addProceedingSuccess({ proceeding: res })),
          catchError(error =>
            of(A.addProceedingFailure({ error }))
          )
        )
      )
    )
  );

  addSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addProceedingSuccess),
      map(() => A.loadProceedings({}))
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateProceeding),
      mergeMap(action =>
        this.service.update(action.proceeding).pipe(
          map(res => A.updateProceedingSuccess({ proceeding: res })),
          catchError(error =>
            of(A.updateProceedingFailure({ error }))
          )
        )
      )
    )
  );

  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateProceedingSuccess),
      map(() => A.loadProceedings({}))
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteProceeding),
      mergeMap(action =>
        this.service.deleteById(action.id).pipe(
          map(() => A.deleteProceedingSuccess({ id: action.id })),
          catchError(error =>
            of(A.deleteProceedingFailure({ error }))
          )
        )
      )
    )
  );

  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteProceedingSuccess),
      withLatestFrom(this.pageNumber$, this.pageSize$),
      map(([, pageNumber, pageSize]) =>
        A.loadProceedings({
          pageNumber: pageNumber ?? 1,
          pageSize: pageSize ?? 10,
          force: true
        })
      )
    )
  );
}
