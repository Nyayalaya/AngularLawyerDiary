import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { DataIntegration, IntegrationResult } from '../models/integration.model';
import { DataIntegrationService } from '../services/data-integration.service';

@Injectable({ providedIn: 'root' })
export class DataIntegrationFacade {
  private dataIntegrationService = inject(DataIntegrationService);

  loadDataIntegrations(pageNumber = 1, pageSize = 1000): Observable<DataIntegration[]> {
    return this.dataIntegrationService.getAll(pageNumber, pageSize).pipe(
      map(response => response.data ?? [])
    );
  }

  addDataIntegration(integration: DataIntegration): Observable<DataIntegration> {
    return this.dataIntegrationService.create(integration);
  }

  updateDataIntegration(integration: DataIntegration): Observable<DataIntegration> {
    return this.dataIntegrationService.update(integration);
  }

  deleteDataIntegration(id: string): Observable<void> {
    return this.dataIntegrationService.deleteById(id);
  }

  saveDataIntegration(integration: DataIntegration): Observable<DataIntegration> {
    return integration.id ? this.updateDataIntegration(integration) : this.addDataIntegration(integration);
  }

  syncIntegration(id: string): Observable<IntegrationResult> {
    return this.dataIntegrationService.syncIntegration(id);
  }

  uploadFile(file: File): Observable<{ fileUrl: string }> {
    return this.dataIntegrationService.uploadFile(file);
  }
}