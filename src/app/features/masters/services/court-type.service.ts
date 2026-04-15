import { Injectable } from '@angular/core';
import { CourtTypeModel } from '../models/court-type.model';
import { ApiEndpoints } from '../../../core';
import { BaseCrudService } from '../../../core/services/base-crud.service';



@Injectable({ providedIn: 'root' })
export class CourtTypeService extends  BaseCrudService<CourtTypeModel>  {
   protected endpoint = ApiEndpoints.COURT_TYPE.BASE_CONTROLLER_URL;
  
}
