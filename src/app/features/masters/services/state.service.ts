import { Injectable } from "@angular/core";
import { ApiEndpoints } from "../../../core";
import { BaseCrudService } from "../../../core/services/base-crud.service";
import { StateModel } from "../models/state.model";

@Injectable({ providedIn: 'root' })
export class StateService extends BaseCrudService<StateModel> 
{
  protected endpoint = ApiEndpoints.STATE.BASE_CONTROLLER_URL;
}