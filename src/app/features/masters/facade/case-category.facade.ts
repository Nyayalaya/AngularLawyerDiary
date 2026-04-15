import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CaseCategory } from '../models/case-category.model';
import * as A from '../store/case-category/case-category.actions';
import * as S from '../store/case-category/case-category.selectors';

@Injectable({ providedIn: 'root' })
export class CaseCategoryFacade {

  private store = inject(Store);

  // ── Selectors ─────────────────────────────────────────────────────
  caseCategories$: Observable<CaseCategory[]>   = this.store.select(S.selectAll);
  loading$:        Observable<boolean>          = this.store.select(S.selectLoading);
  error$:          Observable<string | null>    = this.store.select(S.selectError);
  totalRecords$:   Observable<number>           = this.store.select(S.selectTotalRecords);
  pageNumber$:     Observable<number>           = this.store.select(S.selectPageNumber);
  pageSize$:       Observable<number>           = this.store.select(S.selectPageSize);
  totalPages$:     Observable<number>           = this.store.select(S.selectTotalPages);

  // ── Actions ───────────────────────────────────────────────────────
  load(pageNumber = 1, pageSize = 10, force = false): void {
    this.store.dispatch(
      A.loadCaseCategories({ pageNumber, pageSize, force })
    );
  }

  add(caseCategory: CaseCategory): void {
    this.store.dispatch(A.addCaseCategory({ caseCategory }));
  }

  update(caseCategory: CaseCategory): void {
    this.store.dispatch(A.updateCaseCategory({ caseCategory }));
  }

  delete(id: string): void {
    this.store.dispatch(A.deleteCaseCategory({ id }));
  }
}
