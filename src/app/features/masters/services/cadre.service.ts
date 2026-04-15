import { Injectable } from "@angular/core";
import { ApiEndpoints } from "../../../core";
import { BaseCrudService } from "../../../core/services/base-crud.service";
import { Cadre } from "../models/cadre.model";

@Injectable({ providedIn: 'root' })
export class CadreService extends BaseCrudService<Cadre> 
{
  protected endpoint = ApiEndpoints.CADRE.BASE_CONTROLLER_URL;
}
