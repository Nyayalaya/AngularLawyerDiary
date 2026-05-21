import { Injectable } from "@angular/core";
import { ApiEndpoints } from "../../../core";
import { BaseCrudService } from "../../../core/services/base-crud.service";
import { Proceeding } from "../models/proceeding.model";

@Injectable({ providedIn: 'root' })
export class ProceedingService extends BaseCrudService<Proceeding> 
{
  protected endpoint = ApiEndpoints.PROCEEDING.BASE_CONTROLLER_URL;
}
