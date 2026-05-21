import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import * as A from './form-type.actions';
import * as S from './form-type.selectors';
import { FormTypeService } from '../../services/form-type.service';

@Injectable()
export class FormTypeEffects {

  private actions$ = inject(Actions);
  private store    = inject(Store);
  private service  = inject(FormTypeService);

  private pageNumber$ = this.store.select(S.selectPageNumber);
  private pageSize$   = this.store.select(S.selectPageSize);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadFormTypes),
      switchMap(action =>
        this.service.getAll(
          action.pageNumber ?? 1,
          action.pageSize ?? 10
        ).pipe(
          map(res => A.loadFormTypesSuccess({ 
            formTypes: res.data,
            totalRecords: res.pagination.totalCount,
            pageNumber: res.pagination.pageNumber,
            pageSize: res.pagination.pageSize,
            totalPages: res.pagination.totalPages
          })),
          catchError(error =>
            of(A.loadFormTypesFailure({ error }))
          )
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addFormType),
      mergeMap(action =>
        this.service.create(action.formType).pipe(
          map(res => A.addFormTypeSuccess({ formType: res })),
          catchError(error =>
            of(A.addFormTypeFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful add
  addSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addFormTypeSuccess),
      map(() => A.loadFormTypes({}))
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateFormType),
      mergeMap(action =>
        this.service.update(action.formType).pipe(
          map(res => A.updateFormTypeSuccess({ formType: res })),
          catchError(error =>
            of(A.updateFormTypeFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful update
  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateFormTypeSuccess),
      map(() => A.loadFormTypes({}))
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteFormType),
      mergeMap(action =>
        this.service.deleteById(action.id).pipe(
          map(() => A.deleteFormTypeSuccess({ id: action.id })),
          catchError(error =>
            of(A.deleteFormTypeFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful delete
  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteFormTypeSuccess),
      withLatestFrom(this.pageNumber$, this.pageSize$),
      map(([, pageNumber, pageSize]) =>
        A.loadFormTypes({
          pageNumber: pageNumber ?? 1,
          pageSize: pageSize ?? 10,
          force: true
        })
      )
    )
  );
}
