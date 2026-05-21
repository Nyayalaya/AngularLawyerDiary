import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import * as A from './form-template.actions';
import * as S from './form-template.selectors';
import { FormTemplateService } from '../../services/form-template.service';

@Injectable()
export class FormTemplateEffects {

  private actions$ = inject(Actions);
  private store    = inject(Store);
  private service  = inject(FormTemplateService);

  private pageNumber$ = this.store.select(S.selectPageNumber);
  private pageSize$   = this.store.select(S.selectPageSize);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadFormTemplates),
      switchMap(action =>
        this.service.getAll(
          action.pageNumber ?? 1,
          action.pageSize ?? 10
        ).pipe(
          map(res => A.loadFormTemplatesSuccess({ 
            formTemplates: res.data,
            totalRecords: res.pagination.totalCount,
            pageNumber: res.pagination.pageNumber,
            pageSize: res.pagination.pageSize,
            totalPages: res.pagination.totalPages
          })),
          catchError(error =>
            of(A.loadFormTemplatesFailure({ error }))
          )
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addFormTemplate),
      mergeMap(action =>
        this.service.create(action.formTemplate).pipe(
          map(res => A.addFormTemplateSuccess({ formTemplate: res })),
          catchError(error =>
            of(A.addFormTemplateFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful add
  addSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addFormTemplateSuccess),
      map(() => A.loadFormTemplates({}))
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateFormTemplate),
      mergeMap(action =>
        this.service.update(action.formTemplate).pipe(
          map(res => A.updateFormTemplateSuccess({ formTemplate: res })),
          catchError(error =>
            of(A.updateFormTemplateFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful update
  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateFormTemplateSuccess),
      map(() => A.loadFormTemplates({}))
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteFormTemplate),
      mergeMap(action =>
        this.service.deleteById(action.id).pipe(
          map(() => A.deleteFormTemplateSuccess({ id: action.id })),
          catchError(error =>
            of(A.deleteFormTemplateFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful delete
  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteFormTemplateSuccess),
      withLatestFrom(this.pageNumber$, this.pageSize$),
      map(([, pageNumber, pageSize]) =>
        A.loadFormTemplates({
          pageNumber: pageNumber ?? 1,
          pageSize: pageSize ?? 10,
          force: true
        })
      )
    )
  );
}