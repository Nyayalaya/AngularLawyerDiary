import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CourtLevel } from '../models/court-level.model';
import * as A from '../store/court-level/court-level.actions';
import * as S from '../store/court-level/court-level.selectors';

@Injectable({ providedIn: 'root' })
export class CourtLevelFacade {

  private store = inject(Store);

  // ── Selectors ─────────────────────────────────────────────────────
  courtLevels$:  Observable<CourtLevel[]>      = this.store.select(S.selectAll);
  loading$:      Observable<boolean>           = this.store.select(S.selectLoading);
  error$:        Observable<string | null>     = this.store.select(S.selectError);
  totalRecords$: Observable<number>            = this.store.select(S.selectTotalRecords);
  pageNumber$:   Observable<number>            = this.store.select(S.selectPageNumber);
  pageSize$:     Observable<number>            = this.store.select(S.selectPageSize);
  totalPages$:   Observable<number>            = this.store.select(S.selectTotalPages);

  // ── Actions ───────────────────────────────────────────────────────
  load(pageNumber = 1, pageSize = 10, force = false): void {
    this.store.dispatch(
      A.loadCourtLevels({ pageNumber, pageSize, force })
    );
  }

  add(courtLevel: CourtLevel): void {
    this.store.dispatch(A.addCourtLevel({ courtLevel }));
  }

  update(courtLevel: CourtLevel): void {
    this.store.dispatch(A.updateCourtLevel({ courtLevel }));
  }

  delete(id: string): void {
    this.store.dispatch(A.deleteCourtLevel({ id }));
  }
}
