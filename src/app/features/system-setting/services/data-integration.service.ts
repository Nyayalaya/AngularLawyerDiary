import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiEndpoints } from '../../../core';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { DataIntegration, IntegrationResult } from '../models/integration.model';

@Injectable({ providedIn: 'root' })
export class DataIntegrationService extends BaseCrudService<DataIntegration> {
  protected endpoint = ApiEndpoints.DATA_INTEGRATION.BASE_CONTROLLER_URL;

  syncIntegration(id: string): Observable<IntegrationResult> {
    return this.post<IntegrationResult>(
      ApiEndpoints.DATA_INTEGRATION.SYNC.replace('{{id}}', id),
      {}
    );
  }

  uploadFile(file: File): Observable<{ fileUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.post<{ fileUrl: string }>(`${this.endpoint}/upload`, formData);
  }
}