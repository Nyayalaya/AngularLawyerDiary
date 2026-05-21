import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Work } from '../models/work.model';
import * as A from '../store/work/work.actions';
import * as S from '../store/work/work.selectors';

@Injectable({ providedIn: 'root' })
export class WorkFacade {

  private store = inject(Store);

  works$:             Observable<Work[]>               = this.store.select(S.selectAll);
  loading$:           Observable<boolean>              = this.store.select(S.selectLoading);
  error$:             Observable<string | null>        = this.store.select(S.selectError);
  totalRecords$:      Observable<number>               = this.store.select(S.selectTotalRecords);
  pageNumber$:        Observable<number>               = this.store.select(S.selectPageNumber);
  pageSize$:          Observable<number>               = this.store.select(S.selectPageSize);
  totalPages$:        Observable<number>               = this.store.select(S.selectTotalPages);

  load(pageNumber = 1, pageSize = 10, force = false): void {
    this.store.dispatch(
      A.loadWorks({ pageNumber, pageSize, force })
    );
  }

  add(work: Work): void {
    this.store.dispatch(A.addWork({ work }));
  }

  update(work: Work): void {
    this.store.dispatch(A.updateWork({ work }));
  }

  delete(id: string): void {
    this.store.dispatch(A.deleteWork({ id }));
  }
}
