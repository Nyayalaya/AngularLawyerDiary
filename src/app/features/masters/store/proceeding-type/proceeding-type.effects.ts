import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import * as A from './proceeding-type.actions';
import * as S from './proceeding-type.selectors';
import { ProceedingTypeService } from '../../services/proceeding-type.service';

@Injectable()
export class ProceedingTypeEffects {

  private actions$ = inject(Actions);
  private store    = inject(Store);
  private service  = inject(ProceedingTypeService);

  private pageNumber$ = this.store.select(S.selectPageNumber);
  private pageSize$   = this.store.select(S.selectPageSize);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadProceedingTypes),
      switchMap(action =>
        this.service.getAll(
          action.pageNumber ?? 1,
          action.pageSize ?? 10
        ).pipe(
          map(res => A.loadProceedingTypesSuccess({ 
            proceedingTypes: res.data,
            totalRecords: res.pagination.totalCount,
            pageNumber: res.pagination.pageNumber,
            pageSize: res.pagination.pageSize,
            totalPages: res.pagination.totalPages
          })),
          catchError(error =>
            of(A.loadProceedingTypesFailure({ error }))
          )
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addProceedingType),
      mergeMap(action =>
        this.service.create(action.proceedingType).pipe(
          map(res => A.addProceedingTypeSuccess({ proceedingType: res })),
          catchError(error =>
            of(A.addProceedingTypeFailure({ error }))
          )
        )
      )
    )
  );

  addSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addProceedingTypeSuccess),
      map(() => A.loadProceedingTypes({}))
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateProceedingType),
      mergeMap(action =>
        this.service.update(action.proceedingType).pipe(
          map(res => A.updateProceedingTypeSuccess({ proceedingType: res })),
          catchError(error =>
            of(A.updateProceedingTypeFailure({ error }))
          )
        )
      )
    )
  );

  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateProceedingTypeSuccess),
      map(() => A.loadProceedingTypes({}))
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteProceedingType),
      mergeMap(action =>
        this.service.deleteById(action.id).pipe(
          map(() => A.deleteProceedingTypeSuccess({ id: action.id })),
          catchError(error =>
            of(A.deleteProceedingTypeFailure({ error }))
          )
        )
      )
    )
  );

  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteProceedingTypeSuccess),
      withLatestFrom(this.pageNumber$, this.pageSize$),
      map(([, pageNumber, pageSize]) =>
        A.loadProceedingTypes({
          pageNumber: pageNumber ?? 1,
          pageSize: pageSize ?? 10,
          force: true
        })
      )
    )
  );
}
