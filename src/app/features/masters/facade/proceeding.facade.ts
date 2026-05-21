import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Proceeding } from '../models/proceeding.model';
import * as A from '../store/proceeding/proceeding.actions';
import * as S from '../store/proceeding/proceeding.selectors';

@Injectable({ providedIn: 'root' })
export class ProceedingFacade {

  private store = inject(Store);

  proceedings$:       Observable<Proceeding[]>         = this.store.select(S.selectAll);
  loading$:           Observable<boolean>              = this.store.select(S.selectLoading);
  error$:             Observable<string | null>        = this.store.select(S.selectError);
  totalRecords$:      Observable<number>               = this.store.select(S.selectTotalRecords);
  pageNumber$:        Observable<number>               = this.store.select(S.selectPageNumber);
  pageSize$:          Observable<number>               = this.store.select(S.selectPageSize);
  totalPages$:        Observable<number>               = this.store.select(S.selectTotalPages);

  load(pageNumber = 1, pageSize = 10, force = false): void {
    this.store.dispatch(
      A.loadProceedings({ pageNumber, pageSize, force })
    );
  }

  add(proceeding: Proceeding): void {
    this.store.dispatch(A.addProceeding({ proceeding }));
  }

  update(proceeding: Proceeding): void {
    this.store.dispatch(A.updateProceeding({ proceeding }));
  }

  delete(id: string): void {
    this.store.dispatch(A.deleteProceeding({ id }));
  }
}
