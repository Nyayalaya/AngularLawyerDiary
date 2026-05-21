import { Injectable } from "@angular/core";
import { ApiEndpoints } from "../../../core";
import { BaseCrudService } from "../../../core/services/base-crud.service";
import { Work } from "../models/work.model";

@Injectable({ providedIn: 'root' })
export class WorkService extends BaseCrudService<Work> 
{
  protected endpoint = ApiEndpoints.WORK.BASE_CONTROLLER_URL;
}
