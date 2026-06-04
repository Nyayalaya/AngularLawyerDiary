import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiEndpoints } from '../../../core';
import { ApiResponse, BaseCrudService } from '../../../core/services/base-crud.service';
import { CasesListDto } from '../dtos/case-list.dto';
import { CaseManage } from '../models/case-manage.model';

@Injectable({ providedIn: 'root' })
export class CaseManageService extends BaseCrudService<CaseManage> {
  protected endpoint = ApiEndpoints.CASE_MANAGEMENT.BASE_CONTROLLER_URL;

  getCaseList(pageNumber = 1, pageSize = 10): Observable<ApiResponse<CasesListDto[]>> {
    return this.get<ApiResponse<CasesListDto[]>>(this.endpoint, {
      pageNumber,
      pageSize
    });
  }
}
