import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Client } from '../models/client.model';
import * as A from '../store/client/client.actions';
import * as S from '../store/client/client.selectors';

@Injectable({ providedIn: 'root' })
export class ClientFacade {
  private store = inject(Store);

  clients$: Observable<Client[]> = this.store.select(S.selectAll);
  loading$: Observable<boolean> = this.store.select(S.selectLoading);
  error$: Observable<string | null> = this.store.select(S.selectError);
  totalRecords$: Observable<number> = this.store.select(S.selectTotalRecords);
  pageNumber$: Observable<number> = this.store.select(S.selectPageNumber);
  pageSize$: Observable<number> = this.store.select(S.selectPageSize);
  totalPages$: Observable<number> = this.store.select(S.selectTotalPages);

  load(pageNumber = 1, pageSize = 10, force = false): void {
    this.store.dispatch(
      A.loadClients({ pageNumber, pageSize, force })
    );
  }

  add(client: Client): void {
    this.store.dispatch(A.addClient({ client }));
  }

  update(client: Client): void {
    this.store.dispatch(A.updateClient({ client }));
  }

  delete(id: string): void {
    this.store.dispatch(A.deleteClient({ id }));
  }
}
