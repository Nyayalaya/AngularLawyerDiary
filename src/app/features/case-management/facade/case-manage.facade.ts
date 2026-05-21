import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { CaseManage } from '../models/case-manage.model';
import { CaseManageService } from '../services/case-manage.service';

@Injectable({ providedIn: 'root' })
export class CaseManageFacade {
  private service = inject(CaseManageService);

  createCase(model: CaseManage): Observable<CaseManage> {
    return this.service.create(model);
  }

  updateCase(model: CaseManage): Observable<CaseManage> {
    return this.service.update(model);
  }

  saveCase(model: CaseManage): Observable<CaseManage> {
    return model.id ? this.updateCase(model) : this.createCase(model);
  }
}
