import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import * as A from './work-type.actions';
import * as S from './work-type.selectors';
import { WorkTypeService } from '../../services/work-type.service';

@Injectable()
export class WorkTypeEffects {

  private actions$ = inject(Actions);
  private store    = inject(Store);
  private service  = inject(WorkTypeService);

  private pageNumber$ = this.store.select(S.selectPageNumber);
  private pageSize$   = this.store.select(S.selectPageSize);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadWorkTypes),
      switchMap(action =>
        this.service.getAll(
          action.pageNumber ?? 1,
          action.pageSize ?? 10
        ).pipe(
          map(res => A.loadWorkTypesSuccess({ 
            workTypes: res.data,
            totalRecords: res.pagination.totalCount,
            pageNumber: res.pagination.pageNumber,
            pageSize: res.pagination.pageSize,
            totalPages: res.pagination.totalPages
          })),
          catchError(error =>
            of(A.loadWorkTypesFailure({ error }))
          )
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addWorkType),
      mergeMap(action =>
        this.service.create(action.workType).pipe(
          map(res => A.addWorkTypeSuccess({ workType: res })),
          catchError(error =>
            of(A.addWorkTypeFailure({ error }))
          )
        )
      )
    )
  );

  addSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addWorkTypeSuccess),
      map(() => A.loadWorkTypes({}))
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateWorkType),
      mergeMap(action =>
        this.service.update(action.workType).pipe(
          map(res => A.updateWorkTypeSuccess({ workType: res })),
          catchError(error =>
            of(A.updateWorkTypeFailure({ error }))
          )
        )
      )
    )
  );

  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateWorkTypeSuccess),
      map(() => A.loadWorkTypes({}))
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteWorkType),
      mergeMap(action =>
        this.service.deleteById(action.id).pipe(
          map(() => A.deleteWorkTypeSuccess({ id: action.id })),
          catchError(error =>
            of(A.deleteWorkTypeFailure({ error }))
          )
        )
      )
    )
  );

  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteWorkTypeSuccess),
      withLatestFrom(this.pageNumber$, this.pageSize$),
      map(([, pageNumber, pageSize]) =>
        A.loadWorkTypes({
          pageNumber: pageNumber ?? 1,
          pageSize: pageSize ?? 10,
          force: true
        })
      )
    )
  );
}
