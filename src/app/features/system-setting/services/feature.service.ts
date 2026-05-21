import { Injectable } from '@angular/core';

import { ApiEndpoints } from '../../../core';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { Feature } from '../models/feature.model';

@Injectable({ providedIn: 'root' })
export class FeatureService extends BaseCrudService<Feature> {
  protected endpoint = ApiEndpoints.FEATURE.BASE_CONTROLLER_URL;
}