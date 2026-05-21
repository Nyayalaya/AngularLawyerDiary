import { Injectable } from "@angular/core";
import { ApiEndpoints } from "../../../core";
import { BaseCrudService } from "../../../core/services/base-crud.service";
import { FormMasterModel } from "../models/form-master.model";

@Injectable({ providedIn: 'root' })
export class FormMasterService extends BaseCrudService<FormMasterModel> 
{
  protected endpoint = ApiEndpoints.FORM.FORMMASTER;
}
