import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { CourtDistrict } from '../models/court-district.model';
import * as A from '../store/court-district/court-district.actions';
import * as S from '../store/court-district/court-district.selectors';

@Injectable({ providedIn: 'root' })
export class CourtDistrictFacade {

  private store = inject(Store);

  // ── Selectors ─────────────────────────────────────────────────────
  courtDistricts$: Observable<CourtDistrict[]>     = this.store.select(S.selectAll);
  loading$:        Observable<boolean>             = this.store.select(S.selectLoading);
  error$:          Observable<string | null>       = this.store.select(S.selectError);
  totalRecords$:   Observable<number>              = this.store.select(S.selectTotalRecords);
  pageNumber$:     Observable<number>              = this.store.select(S.selectPageNumber);
  pageSize$:       Observable<number>              = this.store.select(S.selectPageSize);
  totalPages$:     Observable<number>              = this.store.select(S.selectTotalPages);

  // ── Actions ───────────────────────────────────────────────────────
  load(pageNumber = 1, pageSize = 10, force = false): void {
    this.store.dispatch(
      A.loadCourtDistricts({ pageNumber, pageSize, force })
    );
  }

  add(courtDistrict: CourtDistrict): void {
    this.store.dispatch(A.addCourtDistrict({ courtDistrict }));
  }

  update(courtDistrict: CourtDistrict): void {
    this.store.dispatch(A.updateCourtDistrict({ courtDistrict }));
  }

  delete(id: string): void {
    this.store.dispatch(A.deleteCourtDistrict({ id }));
  }

  submitDistrictsByState(stateId: number, districts: any[], languages: any[]): void {
    this.store.dispatch(A.submitDistrictsByState({ stateId, districts, languages }));
  }
}
