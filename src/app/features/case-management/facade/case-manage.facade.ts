import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiResponse } from '../../../core/services/base-crud.service';
import { CasesListDto } from '../dtos/case-list.dto';
import { CaseManage } from '../models/case-manage.model';
import { CaseManageService } from '../services/case-manage.service';

@Injectable({ providedIn: 'root' })
export class CaseManageFacade {
  private service = inject(CaseManageService);

  loadCases(pageNumber = 1, pageSize = 10): Observable<ApiResponse<CasesListDto[]>> {
    return this.service.getCaseList(pageNumber, pageSize);
  }

  getCaseById(id: string): Observable<CaseManage> {
    return this.service.getById(id);
  }

  createCase(model: CaseManage): Observable<CaseManage> {
    return this.service.create(model);
  }

  updateCase(model: CaseManage): Observable<CaseManage> {
    return this.service.update(model);
  }

  saveCase(model: CaseManage): Observable<CaseManage> {
    return model.id ? this.updateCase(model) : this.createCase(model);
  }

  deleteCase(id: string): Observable<void> {
    return this.service.deleteById(id);
  }
}
