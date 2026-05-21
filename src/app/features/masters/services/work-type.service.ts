import { Injectable } from "@angular/core";
import { ApiEndpoints } from "../../../core";
import { BaseCrudService } from "../../../core/services/base-crud.service";
import { WorkType } from "../models/work-type.model";

@Injectable({ providedIn: 'root' })
export class WorkTypeService extends BaseCrudService<WorkType> 
{
  protected endpoint = ApiEndpoints.WORK_TYPE.BASE_CONTROLLER_URL;
}
