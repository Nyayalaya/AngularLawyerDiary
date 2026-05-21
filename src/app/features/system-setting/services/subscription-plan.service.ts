import { Injectable } from '@angular/core';

import { ApiEndpoints } from '../../../core';
import { BaseCrudService } from '../../../core/services/base-crud.service';
import { SubscriptionPlan } from '../models/subscription.model';

@Injectable({ providedIn: 'root' })
export class SubscriptionPlanService extends BaseCrudService<SubscriptionPlan> {
  protected endpoint = ApiEndpoints.SUBSCRIPTION_PLAN.BASE_CONTROLLER_URL;
}