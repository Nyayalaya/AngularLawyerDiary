import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { GenericTable, GenericFormModel } from '../../../../shared';
import { FeatureFacade } from '../../facade/feature.facade';
import { Feature } from '../../models/feature.model';

@Component({
  selector: 'app-feature-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericFormModel],
  templateUrl: './feature-management.html',
  styleUrls: ['./feature-management.css']
})
export class FeatureManagementComponent implements OnInit {
  private fb = inject(FormBuilder);
  private featureFacade = inject(FeatureFacade);

  features = signal<Feature[]>([]);
  loading = signal(false);
  showFeatureForm = signal(false);
  isEditMode = signal(false);

  featureForm: FormGroup = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(2)]],
    description: ['', [Validators.required]],
    isActive: [true]
  });

  columns = [
    { key: 'id', label: 'Id', isKey: true },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'isActive', label: 'Active', type: 'boolean' }
  ];

  ngOnInit(): void {
    this.loadFeatures();
  }

  loadFeatures(): void {
    this.loading.set(true);
    this.featureFacade.loadFeatures().subscribe({
      next: features => {
        this.features.set(features);
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        Swal.fire('Error', error.message ?? 'Unable to load features.', 'error');
      }
    });
  }

  openAddFeature(): void {
    this.isEditMode.set(false);
    this.featureForm.reset({ id: '', name: '', description: '', isActive: true });
    this.showFeatureForm.set(true);
  }

  onEdit(feature: Feature): void {
    this.isEditMode.set(true);
    this.featureForm.patchValue(feature);
    this.showFeatureForm.set(true);
  }

  onDelete(feature: Feature): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the feature "${feature.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.featureFacade.deleteFeature(feature.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Feature has been deleted.', 'success');
            this.loadFeatures();
          },
          error: error => Swal.fire('Error', error.message ?? 'Unable to delete feature.', 'error')
        });
      }
    });
  }

  saveFeature(): void {
    if (this.featureForm.invalid) {
      this.featureForm.markAllAsTouched();
      return;
    }

    const feature = this.featureForm.getRawValue() as Feature;

    this.featureFacade.saveFeature(feature).subscribe({
      next: () => {
        Swal.fire('Success', `Feature ${feature.id ? 'updated' : 'created'} successfully.`, 'success');
        this.showFeatureForm.set(false);
        this.loadFeatures();
      },
      error: error => Swal.fire('Error', error.message ?? 'Unable to save feature.', 'error')
    });
  }
}