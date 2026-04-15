import { Injectable } from "@angular/core";
import { ApiEndpoints } from "../../../core";
import { BaseCrudService } from "../../../core/services/base-crud.service";
import { CourtDistrict } from "../models/court-district.model";
import { Observable } from "rxjs";

interface Language {
  code: string;
  name: string;
}

interface DistrictSubmissionPayload {
  createRequestData: Array<{ stateId: number; name: string }>;
  languages: Language[];
}

@Injectable({ providedIn: 'root' })
export class CourtDistrictService extends BaseCrudService<CourtDistrict> 
{
  protected endpoint = ApiEndpoints.COURT_DISTRICT.BASE_CONTROLLER_URL;

  submitDistrictsByState(stateId: number, districts: CourtDistrict[], languages: Language[]): Observable<any> {
    const payload: DistrictSubmissionPayload = {
      createRequestData: districts.map(d => ({
        stateId: d.stateId,
        name: d.name
      })),
      languages: languages
    };
    return this.post(this.endpoint, payload);
  }
}
