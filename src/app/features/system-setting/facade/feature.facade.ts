import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Feature } from '../models/feature.model';
import { FeatureService } from '../services/feature.service';

@Injectable({ providedIn: 'root' })
export class FeatureFacade {
  private featureService = inject(FeatureService);

  loadFeatures(pageNumber = 1, pageSize = 1000): Observable<Feature[]> {
    return this.featureService.getAll(pageNumber, pageSize).pipe(
      map(response => response.data ?? [])
    );
  }

  addFeature(feature: Feature): Observable<Feature> {
    return this.featureService.create(feature);
  }

  updateFeature(feature: Feature): Observable<Feature> {
    return this.featureService.update(feature);
  }

  deleteFeature(id: string): Observable<void> {
    return this.featureService.deleteById(id);
  }

  saveFeature(feature: Feature): Observable<Feature> {
    return feature.id ? this.updateFeature(feature) : this.addFeature(feature);
  }
}