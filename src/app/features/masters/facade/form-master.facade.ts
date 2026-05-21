import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { FormMasterModel } from '../models/form-master.model';
import * as A from '../store/form-master/form-master.actions';
import * as S from '../store/form-master/form-master.selectors';

@Injectable({ providedIn: 'root' })
export class FormMasterFacade {

  private store = inject(Store);

  // ── Selectors ─────────────────────────────────────────────────────
  formMasters$:  Observable<FormMasterModel[]>    = this.store.select(S.selectAll);
  loading$:      Observable<boolean>              = this.store.select(S.selectLoading);
  error$:        Observable<string | null>        = this.store.select(S.selectError);
  totalRecords$: Observable<number>               = this.store.select(S.selectTotalRecords);
  pageNumber$:   Observable<number>               = this.store.select(S.selectPageNumber);
  pageSize$:     Observable<number>               = this.store.select(S.selectPageSize);
  totalPages$:   Observable<number>               = this.store.select(S.selectTotalPages);

  // ── Actions ───────────────────────────────────────────────────────
  load(pageNumber = 1, pageSize = 10, force = false): void {
    this.store.dispatch(
      A.loadFormMasters({ pageNumber, pageSize, force })
    );
  }

  add(formMaster: FormMasterModel): void {
    this.store.dispatch(A.addFormMaster({ formMaster }));
  }

  update(formMaster: FormMasterModel): void {
    this.store.dispatch(A.updateFormMaster({ formMaster }));
  }

  delete(id: string): void {
    this.store.dispatch(A.deleteFormMaster({ id }));
  }
}
