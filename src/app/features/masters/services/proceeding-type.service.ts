import { Injectable } from "@angular/core";
import { ApiEndpoints } from "../../../core";
import { BaseCrudService } from "../../../core/services/base-crud.service";
import { ProceedingType } from "../models/proceeding-type.model";

@Injectable({ providedIn: 'root' })
export class ProceedingTypeService extends BaseCrudService<ProceedingType> 
{
  protected endpoint = ApiEndpoints.PROCEEDING_TYPE.BASE_CONTROLLER_URL;
}
