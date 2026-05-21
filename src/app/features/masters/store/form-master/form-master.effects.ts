import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import * as A from './form-master.actions';
import * as S from './form-master.selectors';
import { FormMasterService } from '../../services/form-master.service';

@Injectable()
export class FormMasterEffects {

  private actions$ = inject(Actions);
  private store    = inject(Store);
  private service  = inject(FormMasterService);

  private pageNumber$ = this.store.select(S.selectPageNumber);
  private pageSize$   = this.store.select(S.selectPageSize);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadFormMasters),
      switchMap(action =>
        this.service.getAll(
          action.pageNumber ?? 1,
          action.pageSize ?? 10
        ).pipe(
          map(res => A.loadFormMastersSuccess({ 
            formMasters: res.data,
            totalRecords: res.pagination.totalCount,
            pageNumber: res.pagination.pageNumber,
            pageSize: res.pagination.pageSize,
            totalPages: res.pagination.totalPages
          })),
          catchError(error =>
            of(A.loadFormMastersFailure({ error }))
          )
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addFormMaster),
      mergeMap(action =>
        this.service.create(action.formMaster).pipe(
          map(res => A.addFormMasterSuccess({ formMaster: res })),
          catchError(error =>
            of(A.addFormMasterFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful add
  addSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addFormMasterSuccess),
      map(() => A.loadFormMasters({}))
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateFormMaster),
      mergeMap(action =>
        this.service.update(action.formMaster).pipe(
          map(res => A.updateFormMasterSuccess({ formMaster: res })),
          catchError(error =>
            of(A.updateFormMasterFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful update
  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateFormMasterSuccess),
      map(() => A.loadFormMasters({}))
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteFormMaster),
      mergeMap(action =>
        this.service.deleteById(action.id).pipe(
          map(() => A.deleteFormMasterSuccess({ id: action.id })),
          catchError(error =>
            of(A.deleteFormMasterFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful delete
  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteFormMasterSuccess),
      withLatestFrom(this.pageNumber$, this.pageSize$),
      map(([, pageNumber, pageSize]) =>
        A.loadFormMasters({
          pageNumber: pageNumber ?? 1,
          pageSize: pageSize ?? 10,
          force: true
        })
      )
    )
  );
}
