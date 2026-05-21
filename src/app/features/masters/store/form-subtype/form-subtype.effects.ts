import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import * as A from './form-subtype.actions';
import * as S from './form-subtype.selectors';
import { FormSubTypeService } from '../../services/form-subtype.service';

@Injectable()
export class FormSubTypeEffects {

  private actions$ = inject(Actions);
  private store    = inject(Store);
  private service  = inject(FormSubTypeService);

  private pageNumber$ = this.store.select(S.selectPageNumber);
  private pageSize$   = this.store.select(S.selectPageSize);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadFormSubTypes),
      switchMap(action =>
        this.service.getAll(
          action.pageNumber ?? 1,
          action.pageSize ?? 10
        ).pipe(
          map(res => A.loadFormSubTypesSuccess({ 
            formSubTypes: res.data,
            totalRecords: res.pagination.totalCount,
            pageNumber: res.pagination.pageNumber,
            pageSize: res.pagination.pageSize,
            totalPages: res.pagination.totalPages
          })),
          catchError(error =>
            of(A.loadFormSubTypesFailure({ error }))
          )
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addFormSubType),
      mergeMap(action =>
        this.service.create(action.formSubType).pipe(
          map(res => A.addFormSubTypeSuccess({ formSubType: res })),
          catchError(error =>
            of(A.addFormSubTypeFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful add
  addSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addFormSubTypeSuccess),
      map(() => A.loadFormSubTypes({}))
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateFormSubType),
      mergeMap(action =>
        this.service.update(action.formSubType).pipe(
          map(res => A.updateFormSubTypeSuccess({ formSubType: res })),
          catchError(error =>
            of(A.updateFormSubTypeFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful update
  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateFormSubTypeSuccess),
      map(() => A.loadFormSubTypes({}))
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteFormSubType),
      mergeMap(action =>
        this.service.deleteById(action.id).pipe(
          map(() => A.deleteFormSubTypeSuccess({ id: action.id })),
          catchError(error =>
            of(A.deleteFormSubTypeFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful delete
  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteFormSubTypeSuccess),
      withLatestFrom(this.pageNumber$, this.pageSize$),
      map(([, pageNumber, pageSize]) =>
        A.loadFormSubTypes({
          pageNumber: pageNumber ?? 1,
          pageSize: pageSize ?? 10,
          force: true
        })
      )
    )
  );
}
