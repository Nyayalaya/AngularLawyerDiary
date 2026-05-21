import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { FormSubTypeModel } from '../models/form-sub-type-model';
import * as A from '../store/form-subtype/form-subtype.actions';
import * as S from '../store/form-subtype/form-subtype.selectors';

@Injectable({ providedIn: 'root' })
export class FormSubTypeFacade {

  private store = inject(Store);

  // ── Selectors ─────────────────────────────────────────────────────
  formSubTypes$: Observable<FormSubTypeModel[]>   = this.store.select(S.selectAll);
  loading$:      Observable<boolean>              = this.store.select(S.selectLoading);
  error$:        Observable<string | null>        = this.store.select(S.selectError);
  totalRecords$: Observable<number>               = this.store.select(S.selectTotalRecords);
  pageNumber$:   Observable<number>               = this.store.select(S.selectPageNumber);
  pageSize$:     Observable<number>               = this.store.select(S.selectPageSize);
  totalPages$:   Observable<number>               = this.store.select(S.selectTotalPages);

  // ── Actions ───────────────────────────────────────────────────────
  load(pageNumber = 1, pageSize = 10, force = false): void {
    this.store.dispatch(
      A.loadFormSubTypes({ pageNumber, pageSize, force })
    );
  }

  add(formSubType: FormSubTypeModel): void {
    this.store.dispatch(A.addFormSubType({ formSubType }));
  }

  update(formSubType: FormSubTypeModel): void {
    this.store.dispatch(A.updateFormSubType({ formSubType }));
  }

  delete(id: string): void {
    this.store.dispatch(A.deleteFormSubType({ id }));
  }
}
