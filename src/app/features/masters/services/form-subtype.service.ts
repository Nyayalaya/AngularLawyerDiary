import { Injectable } from "@angular/core";
import { ApiEndpoints } from "../../../core";
import { BaseCrudService } from "../../../core/services/base-crud.service";
import { FormSubTypeModel } from "../models/form-sub-type-model";

@Injectable({ providedIn: 'root' })
export class FormSubTypeService extends BaseCrudService<FormSubTypeModel> 
{
  protected endpoint = ApiEndpoints.FORM.FORMSUBTYPE;
}
