import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';
import { Store } from '@ngrx/store';

import * as A from './court-district.actions';
import * as S from './court-district.selectors';
import { CourtDistrictService } from '../../services/court-district.service';

@Injectable()
export class CourtDistrictEffects {

  private actions$ = inject(Actions);
  private store    = inject(Store);
  private service  = inject(CourtDistrictService);

  private pageNumber$ = this.store.select(S.selectPageNumber);
  private pageSize$   = this.store.select(S.selectPageSize);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadCourtDistricts),
      switchMap(action =>
        this.service.getAll(
          action.pageNumber ?? 1,
          action.pageSize ?? 10
        ).pipe(
          map(res => A.loadCourtDistrictsSuccess({ 
            courtDistricts: res.data,
            totalRecords: res.pagination.totalCount,
            pageNumber: res.pagination.pageNumber,
            pageSize: res.pagination.pageSize,
            totalPages: res.pagination.totalPages
          })),
          catchError(error =>
            of(A.loadCourtDistrictsFailure({ error }))
          )
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addCourtDistrict),
      mergeMap(action =>
        this.service.create(action.courtDistrict).pipe(
          map(res => A.addCourtDistrictSuccess({ courtDistrict: res })),
          catchError(error =>
            of(A.addCourtDistrictFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful add
  addSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addCourtDistrictSuccess),
      map(() => A.loadCourtDistricts({}))
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateCourtDistrict),
      mergeMap(action =>
        this.service.update(action.courtDistrict).pipe(
          map(res => A.updateCourtDistrictSuccess({ courtDistrict: res })),
          catchError(error =>
            of(A.updateCourtDistrictFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful update
  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateCourtDistrictSuccess),
      map(() => A.loadCourtDistricts({}))
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteCourtDistrict),
      mergeMap(action =>
        this.service.deleteById(action.id).pipe(
          map(() => A.deleteCourtDistrictSuccess({ id: action.id })),
          catchError(error =>
            of(A.deleteCourtDistrictFailure({ error }))
          )
        )
      )
    )
  );

  // Reload list after successful delete
  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteCourtDistrictSuccess),
      withLatestFrom(this.pageNumber$, this.pageSize$),
      map(([, pageNumber, pageSize]) =>
        A.loadCourtDistricts({
          pageNumber: pageNumber ?? 1,
          pageSize: pageSize ?? 10,
          force: true
        })
      )
    )
  );

  // Submit districts by state (bulk submission)
  submitByState$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.submitDistrictsByState),
      mergeMap(action =>
        this.service.submitDistrictsByState(action.stateId, action.districts, action.languages).pipe(
          map((res: any) => A.submitDistrictsByStateSuccess({ courtDistricts: res })),
          catchError(error =>
            of(A.submitDistrictsByStateFailure({ 
              error: error.message || 'Failed to submit districts' 
            }))
          )
        )
      )
    )
  );

  // Reload list after successful submit by state
  submitByStateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.submitDistrictsByStateSuccess),
      map(() => A.loadCourtDistricts({}))
    )
  );
}
