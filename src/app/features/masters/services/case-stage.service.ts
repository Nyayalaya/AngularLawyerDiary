import { Injectable } from "@angular/core";
import { ApiEndpoints } from "../../../core";
import { BaseCrudService } from "../../../core/services/base-crud.service";
import { CaseStage } from "../models/case-stage.model";

@Injectable({ providedIn: 'root' })
export class CaseStageService extends BaseCrudService<CaseStage> 
{
  protected endpoint = ApiEndpoints.CASE_STAGE.BASE_CONTROLLER_URL;
}
