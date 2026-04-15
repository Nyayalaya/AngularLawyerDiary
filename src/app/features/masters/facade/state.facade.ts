import { inject, Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { Observable } from "rxjs";
import { StateModel } from "../models/state.model";

import * as A from '../store/state-view/m-state.actions';
import * as S from '../store/state-view/m-state.selectors';

@Injectable({ providedIn: 'root' })
export class StateFacade 
{
    private store = inject(Store);

    // ── Selectors ─────────────────────────────────────────────────────
    states$:       Observable<StateModel[]>     = this.store.select(S.selectAll);
    loading$:      Observable<boolean>          = this.store.select(S.selectLoading);
    error$:        Observable<string | null>    = this.store.select(S.selectError);
    totalRecords$: Observable<number>           = this.store.select(S.selectTotalRecords);
    pageNumber$:   Observable<number>           = this.store.select(S.selectPageNumber);
    pageSize$:     Observable<number>           = this.store.select(S.selectPageSize);
    totalPages$:   Observable<number>           = this.store.select(S.selectTotalPages);


    load(pageNumber = 1, pageSize = 10,force=false): void {
        this.store.dispatch(
          A.loadStates({ pageNumber, pageSize, force})
        );
      }

}