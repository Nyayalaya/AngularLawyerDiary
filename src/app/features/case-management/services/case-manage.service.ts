import { Injectable } from '@angular/core';

import { ApiEndpoints } from '../../../core';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { CaseManage } from '../models/case-manage.model';

@Injectable({ providedIn: 'root' })
export class CaseManageService extends BaseCrudService<CaseManage> {
  protected endpoint = ApiEndpoints.CASE_MANAGEMENT.BASE_CONTROLLER_URL;
}
