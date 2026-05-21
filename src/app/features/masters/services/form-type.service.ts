import { Injectable } from "@angular/core";
import { ApiEndpoints } from "../../../core";
import { BaseCrudService } from "../../../core/services/base-crud.service";
import { FormTypeModel } from "../models/form-type.model";

@Injectable({ providedIn: 'root' })
export class FormTypeService extends BaseCrudService<FormTypeModel> 
{
  protected endpoint = ApiEndpoints.FORM.FORMTYPE;
}
