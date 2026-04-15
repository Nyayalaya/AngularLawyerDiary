import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CaseStage } from '../models/case-stage.model';
import * as A from '../store/case-stage/case-stage.actions';
import * as S from '../store/case-stage/case-stage.selectors';

@Injectable({ providedIn: 'root' })
export class CaseStageFacade {

  private store = inject(Store);

  // ── Selectors ─────────────────────────────────────────────────────
  caseStages$:   Observable<CaseStage[]>      = this.store.select(S.selectAll);
  loading$:      Observable<boolean>          = this.store.select(S.selectLoading);
  error$:        Observable<string | null>    = this.store.select(S.selectError);
  totalRecords$: Observable<number>           = this.store.select(S.selectTotalRecords);
  pageNumber$:   Observable<number>           = this.store.select(S.selectPageNumber);
  pageSize$:     Observable<number>           = this.store.select(S.selectPageSize);
  totalPages$:   Observable<number>           = this.store.select(S.selectTotalPages);

  // ── Actions ───────────────────────────────────────────────────────
  load(pageNumber = 1, pageSize = 10, force = false): void {
    this.store.dispatch(
      A.loadCaseStages({ pageNumber, pageSize, force })
    );
  }

  add(caseStage: CaseStage): void {
    this.store.dispatch(A.addCaseStage({ caseStage }));
  }

  update(caseStage: CaseStage): void {
    this.store.dispatch(A.updateCaseStage({ caseStage }));
  }

  delete(id: string): void {
    this.store.dispatch(A.deleteCaseStage({ id }));
  }
}
