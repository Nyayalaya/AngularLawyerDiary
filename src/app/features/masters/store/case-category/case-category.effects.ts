import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import * as A from './case-category.actions';
import * as S from './case-category.selectors';
import { CaseCategoryService } from '../../services/case-category.service';

@Injectable()
export class CaseCategoryEffects {

  private actions$ = inject(Actions);
  private store    = inject(Store);
  private service  = inject(CaseCategoryService);

  private pageNumber$ = this.store.select(S.selectPageNumber);
  private pageSize$   = this.store.select(S.selectPageSize);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadCaseCategories),
      switchMap(action =>
        this.service.getAll(
          action.pageNumber ?? 1,
          action.pageSize ?? 10
        ).pipe(
          map(res => A.loadCaseCategoriesSuccess({ 
            caseCategories: res.data,
            totalRecords: res.pagination.totalCount,
            pageNumber: res.pagination.pageNumber,
            pageSize: res.pagination.pageSize,
            totalPages: res.pagination.totalPages
          })),
          catchError(error =>
            of(A.loadCaseCategoriesFailure({ error }))
          )
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addCaseCategory),
      mergeMap(action =>
        this.service.create(action.caseCategory).pipe(
          map(res => A.addCaseCategorySuccess({ caseCategory: res })),
          catchError(error =>
            of(A.addCaseCategoryFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful add
  addSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addCaseCategorySuccess),
      map(() => A.loadCaseCategories({}))
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateCaseCategory),
      mergeMap(action =>
        this.service.update(action.caseCategory).pipe(
          map(res => A.updateCaseCategorySuccess({ caseCategory: res })),
          catchError(error =>
            of(A.updateCaseCategoryFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful update
  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateCaseCategorySuccess),
      map(() => A.loadCaseCategories({}))
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteCaseCategory),
      mergeMap(action =>
        this.service.deleteById(action.id).pipe(
          map(() => A.deleteCaseCategorySuccess({ id: action.id })),
          catchError(error =>
            of(A.deleteCaseCategoryFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful delete
  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteCaseCategorySuccess),
      withLatestFrom(this.pageNumber$, this.pageSize$),
      map(([, pageNumber, pageSize]) =>
        A.loadCaseCategories({
          pageNumber: pageNumber ?? 1,
          pageSize: pageSize ?? 10,
          force: true
        })
      )
    )
  );
}
