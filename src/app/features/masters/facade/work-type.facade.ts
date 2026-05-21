import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { WorkType } from '../models/work-type.model';
import * as A from '../store/work-type/work-type.actions';
import * as S from '../store/work-type/work-type.selectors';

@Injectable({ providedIn: 'root' })
export class WorkTypeFacade {

  private store = inject(Store);

  workTypes$:         Observable<WorkType[]>           = this.store.select(S.selectAll);
  loading$:           Observable<boolean>              = this.store.select(S.selectLoading);
  error$:             Observable<string | null>        = this.store.select(S.selectError);
  totalRecords$:      Observable<number>               = this.store.select(S.selectTotalRecords);
  pageNumber$:        Observable<number>               = this.store.select(S.selectPageNumber);
  pageSize$:          Observable<number>               = this.store.select(S.selectPageSize);
  totalPages$:        Observable<number>               = this.store.select(S.selectTotalPages);

  load(pageNumber = 1, pageSize = 10, force = false): void {
    this.store.dispatch(
      A.loadWorkTypes({ pageNumber, pageSize, force })
    );
  }

  add(workType: WorkType): void {
    this.store.dispatch(A.addWorkType({ workType }));
  }

  update(workType: WorkType): void {
    this.store.dispatch(A.updateWorkType({ workType }));
  }

  delete(id: string): void {
    this.store.dispatch(A.deleteWorkType({ id }));
  }
}
