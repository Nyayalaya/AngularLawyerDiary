import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import * as A from './work.actions';
import * as S from './work.selectors';
import { WorkService } from '../../services/work.service';

@Injectable()
export class WorkEffects {

  private actions$ = inject(Actions);
  private store    = inject(Store);
  private service  = inject(WorkService);

  private pageNumber$ = this.store.select(S.selectPageNumber);
  private pageSize$   = this.store.select(S.selectPageSize);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadWorks),
      switchMap(action =>
        this.service.getAll(
          action.pageNumber ?? 1,
          action.pageSize ?? 10
        ).pipe(
          map(res => A.loadWorksSuccess({ 
            works: res.data,
            totalRecords: res.pagination.totalCount,
            pageNumber: res.pagination.pageNumber,
            pageSize: res.pagination.pageSize,
            totalPages: res.pagination.totalPages
          })),
          catchError(error =>
            of(A.loadWorksFailure({ error }))
          )
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addWork),
      mergeMap(action =>
        this.service.create(action.work).pipe(
          map(res => A.addWorkSuccess({ work: res })),
          catchError(error =>
            of(A.addWorkFailure({ error }))
          )
        )
      )
    )
  );

  addSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addWorkSuccess),
      map(() => A.loadWorks({}))
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateWork),
      mergeMap(action =>
        this.service.update(action.work).pipe(
          map(res => A.updateWorkSuccess({ work: res })),
          catchError(error =>
            of(A.updateWorkFailure({ error }))
          )
        )
      )
    )
  );

  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateWorkSuccess),
      map(() => A.loadWorks({}))
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteWork),
      mergeMap(action =>
        this.service.deleteById(action.id).pipe(
          map(() => A.deleteWorkSuccess({ id: action.id })),
          catchError(error =>
            of(A.deleteWorkFailure({ error }))
          )
        )
      )
    )
  );

  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteWorkSuccess),
      withLatestFrom(this.pageNumber$, this.pageSize$),
      map(([, pageNumber, pageSize]) =>
        A.loadWorks({
          pageNumber: pageNumber ?? 1,
          pageSize: pageSize ?? 10,
          force: true
        })
      )
    )
  );
}
