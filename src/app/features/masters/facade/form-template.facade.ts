import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { FormTemplateModel } from '../models/form-template.model';
import * as A from '../store/form-template/form-template.actions';
import * as S from '../store/form-template/form-template.selectors';

@Injectable({ providedIn: 'root' })
export class FormTemplateFacade {

  private store = inject(Store);

  // ── Selectors ─────────────────────────────────────────────────────
  formTemplates$: Observable<FormTemplateModel[]>  = this.store.select(S.selectAll);
  loading$:       Observable<boolean>              = this.store.select(S.selectLoading);
  error$:         Observable<string | null>        = this.store.select(S.selectError);
  totalRecords$:  Observable<number>               = this.store.select(S.selectTotalRecords);
  pageNumber$:    Observable<number>               = this.store.select(S.selectPageNumber);
  pageSize$:      Observable<number>               = this.store.select(S.selectPageSize);
  totalPages$:    Observable<number>               = this.store.select(S.selectTotalPages);

  // ── Actions ───────────────────────────────────────────────────────
  load(pageNumber = 1, pageSize = 10, force = false): void {
    this.store.dispatch(
      A.loadFormTemplates({ pageNumber, pageSize, force })
    );
  }

  add(formTemplate: FormTemplateModel): void {
    this.store.dispatch(A.addFormTemplate({ formTemplate }));
  }

  update(formTemplate: FormTemplateModel): void {
    this.store.dispatch(A.updateFormTemplate({ formTemplate }));
  }

  delete(id: string): void {
    this.store.dispatch(A.deleteFormTemplate({ id }));
  }
}
