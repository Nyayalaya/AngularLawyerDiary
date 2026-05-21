import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { GenericTable, GenericFormModel } from '../../../../shared';
import { FeatureFacade } from '../../facade/feature.facade';
import { SubscriptionPlanFacade } from '../../facade/subscription-plan.facade';
import { SubscriptionPlan } from '../../models/subscription.model';
import { Feature } from '../../models/feature.model';

@Component({
  selector: 'app-subscription-plans',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericFormModel],
  templateUrl: './subscription-plans.html',
  styleUrls: ['./subscription-plans.css']
})
export class SubscriptionPlansComponent implements OnInit {
  private fb = inject(FormBuilder);
  private subscriptionPlanFacade = inject(SubscriptionPlanFacade);
  private featureFacade = inject(FeatureFacade);

  subscriptionPlans = signal<SubscriptionPlan[]>([]);
  features = signal<Feature[]>([]);
  loading = signal(false);
  showPlanForm = signal(false);
  isEditMode = signal(false);
  selectedFeatureIds = signal<Set<string>>(new Set<string>());

  planForm: FormGroup = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]],
    price: [0, [Validators.required, Validators.min(0)]],
    duration: [1, [Validators.required, Validators.min(1)]],
    maxUsers: [1, [Validators.min(1)]],
    isActive: [true]
  });

  columns = [
    { key: 'id', label: 'Id', isKey: true },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'price', label: 'Price', type: 'currency' },
    { key: 'duration', label: 'Duration (Months)' },
    { key: 'maxUsers', label: 'Max Users' },
    { key: 'isActive', label: 'Active', type: 'boolean' }
  ];

  ngOnInit(): void {
    this.loadSubscriptionPlans();
    this.loadFeatures();
  }

  loadSubscriptionPlans(): void {
    this.loading.set(true);
    this.subscriptionPlanFacade.loadSubscriptionPlans().subscribe({
      next: plans => {
        this.subscriptionPlans.set(plans);
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        Swal.fire('Error', error.message ?? 'Unable to load subscription plans.', 'error');
      }
    });
  }

  loadFeatures(): void {
    this.featureFacade.loadFeatures().subscribe({
      next: features => {
        this.features.set(features.filter(f => f.isActive));
      },
      error: error => {
        console.error('Unable to load features', error);
      }
    });
  }

  openAddPlan(): void {
    this.isEditMode.set(false);
    this.planForm.reset({
      id: '',
      name: '',
      description: '',
      price: 0,
      duration: 1,
      maxUsers: 1,
      isActive: true
    });
    this.selectedFeatureIds.set(new Set<string>());
    this.showPlanForm.set(true);
  }

  onEdit(plan: SubscriptionPlan): void {
    this.isEditMode.set(true);
    this.planForm.patchValue(plan);
    this.selectedFeatureIds.set(new Set(plan.features || []));
    this.showPlanForm.set(true);
  }

  onDelete(plan: SubscriptionPlan): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the plan "${plan.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.subscriptionPlanFacade.deleteSubscriptionPlan(plan.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Subscription plan has been deleted.', 'success');
            this.loadSubscriptionPlans();
          },
          error: error => Swal.fire('Error', error.message ?? 'Unable to delete subscription plan.', 'error')
        });
      }
    });
  }

  toggleFeature(featureId: string, checked: boolean): void {
    const selected = new Set(this.selectedFeatureIds());
    if (checked) {
      selected.add(featureId);
    } else {
      selected.delete(featureId);
    }
    this.selectedFeatureIds.set(selected);
  }

  isFeatureSelected(featureId: string): boolean {
    return this.selectedFeatureIds().has(featureId);
  }

  savePlan(): void {
    if (this.planForm.invalid) {
      this.planForm.markAllAsTouched();
      return;
    }

    const plan = {
      ...this.planForm.getRawValue(),
      features: Array.from(this.selectedFeatureIds())
    } as SubscriptionPlan;

    this.subscriptionPlanFacade.saveSubscriptionPlan(plan).subscribe({
      next: () => {
        Swal.fire('Success', `Subscription plan ${plan.id ? 'updated' : 'created'} successfully.`, 'success');
        this.showPlanForm.set(false);
        this.loadSubscriptionPlans();
      },
      error: error => Swal.fire('Error', error.message ?? 'Unable to save subscription plan.', 'error')
    });
  }
}