import { Injectable } from '@angular/core';
import { BaseCrudService, ApiResponse } from './base-crud.service';
import { Observable } from 'rxjs';

export interface MasterData {
  id?: string;
  name: string;
  description?: string;
  status: 'Active' | 'Inactive';
  createdDate?: string;
  modifiedDate?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MasterDataService extends BaseCrudService<MasterData> {
  protected endpoint = 'api/masters';

  override getAll(pageNumber = 1, pageSize = 10): Observable<ApiResponse<MasterData[]>> {
    return super.getAll(pageNumber, pageSize);
  }
}
