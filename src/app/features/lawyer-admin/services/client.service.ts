import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiEndpoints } from '../../../core';
import { ApiResponse, BaseCrudService } from '../../../core/services/base-crud.service';
import { Client } from '../models/client.model';

@Injectable({ providedIn: 'root' })
export class ClientService extends BaseCrudService<Client> {
  protected endpoint = ApiEndpoints.CLIENT.BASE_CONTROLLER_URL;

  getReferrals(): Observable<string[]> {
    return this.get<ApiResponse<Array<string | { name?: string; referralBy?: string }>> | string[]>(
      ApiEndpoints.CLIENT.REFERRALS
    ).pipe(
      map(response => {
        const values = Array.isArray(response) ? response : response.data;

        return (values ?? [])
          .map(item => typeof item === 'string' ? item : item.name ?? item.referralBy ?? '')
          .filter(Boolean);
      })
    );
  }
}
