import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import * as A from './cadre.actions';
import * as S from './cadre.selectors';
import { CadreService } from '../../services/cadre.service';

@Injectable()
export class CadreEffects {

  private actions$ = inject(Actions);
  private store    = inject(Store);
  private service  = inject(CadreService);

  private pageNumber$ = this.store.select(S.selectPageNumber);
  private pageSize$   = this.store.select(S.selectPageSize);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadCadres),
      switchMap(action =>
        this.service.getAll(
          action.pageNumber ?? 1,
          action.pageSize ?? 10
        ).pipe(
          map(res => A.loadCadresSuccess({ 
            cadres: res.data,
            totalRecords: res.pagination.totalCount,
            pageNumber: res.pagination.pageNumber,
            pageSize: res.pagination.pageSize,
            totalPages: res.pagination.totalPages
          })),
          catchError(error =>
            of(A.loadCadresFailure({ error }))
          )
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addCadre),
      mergeMap(action =>
        this.service.create(action.cadre).pipe(
          map(res => A.addCadreSuccess({ cadre: res })),
          catchError(error =>
            of(A.addCadreFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful add
  addSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addCadreSuccess),
      map(() => A.loadCadres({}))
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateCadre),
      mergeMap(action =>
        this.service.update(action.cadre).pipe(
          map(res => A.updateCadreSuccess({ cadre: res })),
          catchError(error =>
            of(A.updateCadreFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful update
  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateCadreSuccess),
      map(() => A.loadCadres({}))
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteCadre),
      mergeMap(action =>
        this.service.deleteById(action.id).pipe(
          map(() => A.deleteCadreSuccess({ id: action.id })),
          catchError(error =>
            of(A.deleteCadreFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful delete
  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteCadreSuccess),
      withLatestFrom(this.pageNumber$, this.pageSize$),
      map(([, pageNumber, pageSize]) =>
        A.loadCadres({
          pageNumber: pageNumber ?? 1,
          pageSize: pageSize ?? 10,
          force: true
        })
      )
    )
  );
}
