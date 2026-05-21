import { Injectable } from "@angular/core";
import { ApiEndpoints } from "../../../core";
import { BaseCrudService } from "../../../core/services/base-crud.service";
import { FormTemplateModel } from "../models/form-template.model";

@Injectable({ providedIn: 'root' })
export class FormTemplateService extends BaseCrudService<FormTemplateModel> 
{
  protected endpoint = ApiEndpoints.FORM.FORMTEMPLATE;
}
