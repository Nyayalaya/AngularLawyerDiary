import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { SubscriptionPlan } from '../models/subscription.model';
import { SubscriptionPlanService } from '../services/subscription-plan.service';

@Injectable({ providedIn: 'root' })
export class SubscriptionPlanFacade {
  private subscriptionPlanService = inject(SubscriptionPlanService);

  loadSubscriptionPlans(pageNumber = 1, pageSize = 1000): Observable<SubscriptionPlan[]> {
    return this.subscriptionPlanService.getAll(pageNumber, pageSize).pipe(
      map(response => response.data ?? [])
    );
  }

  addSubscriptionPlan(plan: SubscriptionPlan): Observable<SubscriptionPlan> {
    return this.subscriptionPlanService.create(plan);
  }

  updateSubscriptionPlan(plan: SubscriptionPlan): Observable<SubscriptionPlan> {
    return this.subscriptionPlanService.update(plan);
  }

  deleteSubscriptionPlan(id: string): Observable<void> {
    return this.subscriptionPlanService.deleteById(id);
  }

  saveSubscriptionPlan(plan: SubscriptionPlan): Observable<SubscriptionPlan> {
    return plan.id ? this.updateSubscriptionPlan(plan) : this.addSubscriptionPlan(plan);
  }
}