import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { ProceedingType } from '../models/proceeding-type.model';
import * as A from '../store/proceeding-type/proceeding-type.actions';
import * as S from '../store/proceeding-type/proceeding-type.selectors';

@Injectable({ providedIn: 'root' })
export class ProceedingTypeFacade {

  private store = inject(Store);

  proceedingTypes$:   Observable<ProceedingType[]>     = this.store.select(S.selectAll);
  loading$:           Observable<boolean>              = this.store.select(S.selectLoading);
  error$:             Observable<string | null>        = this.store.select(S.selectError);
  totalRecords$:      Observable<number>               = this.store.select(S.selectTotalRecords);
  pageNumber$:        Observable<number>               = this.store.select(S.selectPageNumber);
  pageSize$:          Observable<number>               = this.store.select(S.selectPageSize);
  totalPages$:        Observable<number>               = this.store.select(S.selectTotalPages);

  load(pageNumber = 1, pageSize = 10, force = false): void {
    this.store.dispatch(
      A.loadProceedingTypes({ pageNumber, pageSize, force })
    );
  }

  add(proceedingType: ProceedingType): void {
    this.store.dispatch(A.addProceedingType({ proceedingType }));
  }

  update(proceedingType: ProceedingType): void {
    this.store.dispatch(A.updateProceedingType({ proceedingType }));
  }

  delete(id: string): void {
    this.store.dispatch(A.deleteProceedingType({ id }));
  }
}
