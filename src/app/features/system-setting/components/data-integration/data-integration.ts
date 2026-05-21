import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormArray, FormControl } from '@angular/forms';
import Swal from 'sweetalert2';

import { GenericTable, GenericFormModel } from '../../../../shared';
import { DataIntegrationFacade } from '../../facade/data-integration.facade';
import { DataIntegration, DataMapping, IntegrationResult } from '../../models/integration.model';

@Component({
  selector: 'app-data-integration',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericFormModel],
  templateUrl: './data-integration.html',
  styleUrls: ['./data-integration.css']
})
export class DataIntegrationComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dataIntegrationFacade = inject(DataIntegrationFacade);

  dataIntegrations = signal<DataIntegration[]>([]);
  loading = signal(false);
  showIntegrationForm = signal(false);
  isEditMode = signal(false);
  selectedFile: File | null = null;
  syncing = signal<string | null>(null);

  integrationForm: FormGroup = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(2)]],
    type: ['api', [Validators.required]],
    source: ['', [Validators.required]],
    description: ['', [Validators.required]],
    isActive: [true],
    mapping: this.fb.array([])
  });

  columns = [
    { key: 'id', label: 'Id', isKey: true },
    { key: 'name', label: 'Name' },
    { key: 'type', label: 'Type' },
    { key: 'isActive', label: 'Active', type: 'boolean' },
    { key: 'lastSync', label: 'Last Sync', type: 'date' },
    { key: 'syncStatus', label: 'Status' }
  ];

  ngOnInit(): void {
    this.loadDataIntegrations();
  }

  get mappingFormArray(): FormArray<FormGroup> {
    return this.integrationForm.get('mapping') as FormArray<FormGroup>;
  }

  get mappingControls(): FormGroup[] {
    return this.mappingFormArray.controls as FormGroup[];
  }

  loadDataIntegrations(): void {
    this.loading.set(true);
    this.dataIntegrationFacade.loadDataIntegrations().subscribe({
      next: integrations => {
        this.dataIntegrations.set(integrations);
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        Swal.fire('Error', error.message ?? 'Unable to load data integrations.', 'error');
      }
    });
  }

  openAddIntegration(): void {
    this.isEditMode.set(false);
    this.integrationForm.reset({
      id: '',
      name: '',
      type: 'api',
      source: '',
      description: '',
      isActive: true
    });
    this.mappingFormArray.clear();
    this.selectedFile = null;
    this.showIntegrationForm.set(true);
  }

  onEdit(integration: DataIntegration): void {
    this.isEditMode.set(true);
    this.integrationForm.patchValue({
      id: integration.id,
      name: integration.name,
      type: integration.type,
      source: integration.source,
      description: integration.description,
      isActive: integration.isActive
    });

    this.mappingFormArray.clear();
    (integration.mapping || []).forEach(mapping => {
      this.mappingFormArray.push(this.createMappingFormGroup(mapping));
    });

    this.selectedFile = null;
    this.showIntegrationForm.set(true);
  }

  createMappingFormGroup(mapping: DataMapping): FormGroup {
    return this.fb.group({
      sourceField: [mapping.sourceField, Validators.required],
      targetField: [mapping.targetField, Validators.required],
      dataType: [mapping.dataType, Validators.required],
      required: [mapping.required],
      defaultValue: [mapping.defaultValue]
    });
  }

  onDelete(integration: DataIntegration): void {
    Swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete the integration "${integration.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dataIntegrationFacade.deleteDataIntegration(integration.id).subscribe({
          next: () => {
            Swal.fire('Deleted!', 'Data integration has been deleted.', 'success');
            this.loadDataIntegrations();
          },
          error: error => Swal.fire('Error', error.message ?? 'Unable to delete data integration.', 'error')
        });
      }
    });
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.integrationForm.patchValue({ source: file.name });
    }
  }

  addMapping(): void {
    this.mappingFormArray.push(this.createMappingFormGroup({
      sourceField: '',
      targetField: '',
      dataType: 'string',
      required: false,
      defaultValue: ''
    }));
  }

  removeMapping(index: number): void {
    this.mappingFormArray.removeAt(index);
  }

  async saveIntegration(): Promise<void> {
    if (this.integrationForm.invalid) {
      this.integrationForm.markAllAsTouched();
      return;
    }

    let source = this.integrationForm.get('source')?.value;

    // Handle file upload for Excel/JSON files
    if (this.selectedFile && (this.integrationForm.get('type')?.value === 'excel' || this.integrationForm.get('type')?.value === 'json')) {
      try {
        const uploadResult = await this.dataIntegrationFacade.uploadFile(this.selectedFile).toPromise();
        source = uploadResult?.fileUrl || source;
      } catch (error: any) {
        Swal.fire('Error', error.message ?? 'File upload failed.', 'error');
        return;
      }
    }

    const integration: DataIntegration = {
      ...this.integrationForm.getRawValue(),
      source,
      mapping: this.mappingFormArray.value
    };

    this.dataIntegrationFacade.saveDataIntegration(integration).subscribe({
      next: () => {
        Swal.fire('Success', `Data integration ${integration.id ? 'updated' : 'created'} successfully.`, 'success');
        this.showIntegrationForm.set(false);
        this.loadDataIntegrations();
      },
      error: error => Swal.fire('Error', error.message ?? 'Unable to save data integration.', 'error')
    });
  }

  syncIntegration(integration: DataIntegration): void {
    this.syncing.set(integration.id);
    this.dataIntegrationFacade.syncIntegration(integration.id).subscribe({
      next: (result: IntegrationResult) => {
        this.syncing.set(null);
        if (result.success) {
          Swal.fire('Success', `Sync completed. ${result.recordsProcessed} records processed.`, 'success');
          this.loadDataIntegrations();
        } else {
          Swal.fire('Sync Failed', result.message, 'error');
        }
      },
      error: error => {
        this.syncing.set(null);
        Swal.fire('Error', error.message ?? 'Sync failed.', 'error');
      }
    });
  }

  getStatusBadgeClass(status?: string): string {
    switch (status) {
      case 'success': return 'badge-success';
      case 'failed': return 'badge-danger';
      case 'pending': return 'badge-warning';
      default: return 'badge-secondary';
    }
  }
}