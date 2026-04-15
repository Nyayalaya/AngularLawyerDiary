import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CourtTypeModel } from '../models/court-type.model';
import * as A from '../store/court-type/court-type.actions';
import * as S from '../store/court-type/court-type.selectors';

@Injectable({ providedIn: 'root' })
export class CourtTypeFacade {

  private store = inject(Store);

  // ── Selectors ─────────────────────────────────────────────────────
  courtTypes$:   Observable<CourtTypeModel[]> = this.store.select(S.selectAllCourtTypes);
  loading$:      Observable<boolean>          = this.store.select(S.selectCourtTypeLoading);
  error$:        Observable<string | null>    = this.store.select(S.selectCourtTypeError);
  totalRecords$: Observable<number>           = this.store.select(S.selectTotalRecords);
  pageNumber$:   Observable<number>           = this.store.select(S.selectPageNumber);
  pageSize$:     Observable<number>           = this.store.select(S.selectPageSize);
  totalPages$:   Observable<number>           = this.store.select(S.selectTotalPages);

  // ── Actions ───────────────────────────────────────────────────────
  load(pageNumber = 1, pageSize = 10,force=false): void {
    this.store.dispatch(
      A.loadCourtTypes({ pageNumber, pageSize, force})
    );
  }

  add(courtType: CourtTypeModel): void {
    this.store.dispatch(A.addCourtType({ courtType }));
  }

  update(courtType: CourtTypeModel): void {
    this.store.dispatch(A.updateCourtType({ courtType }));
  }

  delete(id: string): void {
    this.store.dispatch(A.deleteCourtType({ id }));
  }
}