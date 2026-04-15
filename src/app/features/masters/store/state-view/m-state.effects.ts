import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, of, switchMap, withLatestFrom } from 'rxjs';

import * as A from './m-state.actions';
import { StateService } from '../../services/state.service';
import { selectStateMasterState } from './m-state.selectors';

@Injectable()
export class StateEffects {

  private actions$ = inject(Actions);
  private service = inject(StateService);
  private store = inject(Store);

  private readonly CACHE_TIME = 5 * 60 * 1000; // 5 minutes

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadStates),
      withLatestFrom(this.store.select(selectStateMasterState)),
      switchMap(([action, state]) => {

        const isCached =
          state.loaded &&
          state.items?.length > 0 && // 🔥 IMPORTANT
          state.lastFetched &&
          (Date.now() - state.lastFetched < this.CACHE_TIME) &&
          !action.force;

        // ✅ Use cached data
        if (isCached) {
          console.log('🔥 USING CACHE');

          return of(
            A.loadStatesSuccess({
              items: state.items,
              totalRecords: state.totalRecords,
              pageNumber: state.pageNumber,
              pageSize: state.pageSize,
              totalPages: state.totalPages
            })
          );
        }

        // 🌐 Call API
        console.log('🌐 CALLING API');

        return this.service.getAll(
          action.pageNumber ?? state.pageNumber,
          action.pageSize ?? state.pageSize
        ).pipe(
          map(res => A.loadStatesSuccess({
            items: res.data,
            totalRecords: res.pagination.totalCount,
            pageNumber: res.pagination.pageNumber,
            pageSize: res.pagination.pageSize,
            totalPages: res.pagination.totalPages
          })),
          catchError(error =>
            of(A.loadStatesFailure({ error }))
          )
        );
      })
    )
  );
}
