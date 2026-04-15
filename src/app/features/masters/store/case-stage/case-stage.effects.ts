import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import * as A from './case-stage.actions';
import * as S from './case-stage.selectors';
import { CaseStageService } from '../../services/case-stage.service';

@Injectable()
export class CaseStageEffects {

  private actions$ = inject(Actions);
  private store    = inject(Store);
  private service  = inject(CaseStageService);

  private pageNumber$ = this.store.select(S.selectPageNumber);
  private pageSize$   = this.store.select(S.selectPageSize);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadCaseStages),
      switchMap(action =>
        this.service.getAll(
          action.pageNumber ?? 1,
          action.pageSize ?? 10
        ).pipe(
          map(res => A.loadCaseStagesSuccess({ 
            caseStages: res.data,
            totalRecords: res.pagination.totalCount,
            pageNumber: res.pagination.pageNumber,
            pageSize: res.pagination.pageSize,
            totalPages: res.pagination.totalPages
          })),
          catchError(error =>
            of(A.loadCaseStagesFailure({ error }))
          )
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addCaseStage),
      mergeMap(action =>
        this.service.create(action.caseStage).pipe(
          map(res => A.addCaseStageSuccess({ caseStage: res })),
          catchError(error =>
            of(A.addCaseStageFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful add
  addSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addCaseStageSuccess),
      map(() => A.loadCaseStages({}))
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateCaseStage),
      mergeMap(action =>
        this.service.update(action.caseStage).pipe(
          map(res => A.updateCaseStageSuccess({ caseStage: res })),
          catchError(error =>
            of(A.updateCaseStageFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful update
  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateCaseStageSuccess),
      map(() => A.loadCaseStages({}))
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteCaseStage),
      mergeMap(action =>
        this.service.deleteById(action.id).pipe(
          map(() => A.deleteCaseStageSuccess({ id: action.id })),
          catchError(error =>
            of(A.deleteCaseStageFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful delete
  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteCaseStageSuccess),
      withLatestFrom(this.pageNumber$, this.pageSize$),
      map(([, pageNumber, pageSize]) =>
        A.loadCaseStages({
          pageNumber: pageNumber ?? 1,
          pageSize: pageSize ?? 10,
          force: true
        })
      )
    )
  );
}
