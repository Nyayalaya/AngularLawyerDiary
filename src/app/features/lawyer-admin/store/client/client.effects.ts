import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { catchError, map, mergeMap, of, switchMap, withLatestFrom } from 'rxjs';

import { ClientService } from '../../services/client.service';
import * as A from './client.actions';
import * as S from './client.selectors';

@Injectable()
export class ClientEffects {
  private actions$ = inject(Actions);
  private store = inject(Store);
  private service = inject(ClientService);

  private pageNumber$ = this.store.select(S.selectPageNumber);
  private pageSize$ = this.store.select(S.selectPageSize);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadClients),
      switchMap(action =>
        this.service.getAll(
          action.pageNumber ?? 1,
          action.pageSize ?? 10
        ).pipe(
          map(res => A.loadClientsSuccess({
            clients: res.data,
            totalRecords: res.pagination.totalCount,
            pageNumber: res.pagination.pageNumber,
            pageSize: res.pagination.pageSize,
            totalPages: res.pagination.totalPages
          })),
          catchError(error =>
            of(A.loadClientsFailure({ error }))
          )
        )
      )
    )
  );

  add$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addClient),
      mergeMap(action =>
        this.service.create(action.client).pipe(
          map(res => A.addClientSuccess({ client: res })),
          catchError(error =>
            of(A.addClientFailure({ error }))
          )
        )
      )
    )
  );

  addSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.addClientSuccess),
      map(() => A.loadClients({}))
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateClient),
      mergeMap(action =>
        this.service.update(action.client).pipe(
          map(res => A.updateClientSuccess({ client: res })),
          catchError(error =>
            of(A.updateClientFailure({ error }))
          )
        )
      )
    )
  );

  updateSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateClientSuccess),
      map(() => A.loadClients({}))
    )
  );

  delete$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteClient),
      mergeMap(action =>
        this.service.deleteById(action.id).pipe(
          map(() => A.deleteClientSuccess({ id: action.id })),
          catchError(error =>
            of(A.deleteClientFailure({ error }))
          )
        )
      )
    )
  );

  deleteSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.deleteClientSuccess),
      withLatestFrom(this.pageNumber$, this.pageSize$),
      map(([, pageNumber, pageSize]) =>
        A.loadClients({
          pageNumber: pageNumber ?? 1,
          pageSize: pageSize ?? 10,
          force: true
        })
      )
    )
  );
}
