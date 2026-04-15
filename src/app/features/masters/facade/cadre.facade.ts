import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { Cadre } from '../models/cadre.model';
import * as A from '../store/cadre/cadre.actions';
import * as S from '../store/cadre/cadre.selectors';

@Injectable({ providedIn: 'root' })
export class CadreFacade {

  private store = inject(Store);

  // ── Selectors ─────────────────────────────────────────────────────
  cadres$:       Observable<Cadre[]>         = this.store.select(S.selectAll);
  loading$:      Observable<boolean>         = this.store.select(S.selectLoading);
  error$:        Observable<string | null>   = this.store.select(S.selectError);
  totalRecords$: Observable<number>          = this.store.select(S.selectTotalRecords);
  pageNumber$:   Observable<number>          = this.store.select(S.selectPageNumber);
  pageSize$:     Observable<number>          = this.store.select(S.selectPageSize);
  totalPages$:   Observable<number>          = this.store.select(S.selectTotalPages);

  // ── Actions ───────────────────────────────────────────────────────
  load(pageNumber = 1, pageSize = 10, force = false): void {
    this.store.dispatch(
      A.loadCadres({ pageNumber, pageSize, force })
    );
  }

  add(cadre: Cadre): void {
    this.store.dispatch(A.addCadre({ cadre }));
  }

  update(cadre: Cadre): void {
    this.store.dispatch(A.updateCadre({ cadre }));
  }

  delete(id: string): void {
    this.store.dispatch(A.deleteCadre({ id }));
  }
}
