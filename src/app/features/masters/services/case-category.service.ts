import { Injectable } from "@angular/core";
import { ApiEndpoints } from "../../../core";
import { BaseCrudService } from "../../../core/services/base-crud.service";
import { CaseCategory } from "../models/case-category.model";

@Injectable({ providedIn: 'root' })
export class CaseCategoryService extends BaseCrudService<CaseCategory> 
{
  protected endpoint = ApiEndpoints.CASE_CATEGORY.BASE_CONTROLLER_URL;
}
