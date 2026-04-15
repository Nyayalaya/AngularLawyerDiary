import { Injectable } from "@angular/core";
import { ApiEndpoints } from "../../../core";
import { BaseCrudService } from "../../../core/services/base-crud.service";
import { CourtLevel } from "../models/court-level.model";

@Injectable({ providedIn: 'root' })
export class CourtLevelService extends BaseCrudService<CourtLevel> 
{
  protected endpoint = ApiEndpoints.COURT_LEVEL.BASE_CONTROLLER_URL;
}
