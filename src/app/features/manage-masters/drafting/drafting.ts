import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { GenericTable } from '../../../shared/components/generic-table/generic-table';
import { GenericFormModel } from '../../../shared/components/generic-form-model/generic-form-model';
import { MasterDataService } from '../../../core/services/master-data.service';

interface DraftingMaster {
  id?: number;
  name: string;
  description?: string;
  status: string;
}

@Component({
  selector: 'app-drafting',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericTable,
    GenericFormModel
  ],
  templateUrl: './drafting.html',
  styleUrls: ['./drafting.css']
})
export class DraftingComponent implements OnInit {

  private fb = inject(FormBuilder);
  private masterDataService = inject(MasterDataService);
  
  showModal = false;
  isLoading = false;
  data:any;

  columns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' }
  ];

 

  form = this.fb.group({
    id: [0],
    name: ['', Validators.required], 
    description: [''],
    status: ['Active']
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading = true;
    this.masterDataService.getAll(0, 50).subscribe({
      next: (response) => {
        if (response.data) {
          this.data = response.data;
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading drafting masters:', error);
        this.isLoading = false;
        // Fallback dummy data if API fails
        this.data = [
          { id: 1, name: 'Form Type A', description: 'Form Type for Civil', status: 'Active' },
          { id: 2, name: 'Form Master B', description: 'Master template', status: 'Active' },
          { id: 3, name: 'Form SubType C', description: 'Sub type for documents', status: 'Inactive' }
        ];
      }
    });
  }

  onAdd() {
    this.form.reset({ status: 'Active' });
    this.showModal = true;
  }

  onEdit(row: DraftingMaster) {
    this.form.patchValue(row);
    this.showModal = true;
  }

  onView(row: DraftingMaster) {
    alert(JSON.stringify(row, null, 2));
  }

  onDelete(row: DraftingMaster) {

  }

  save(value: DraftingMaster) {
    
  }

  goToAddPage() {
    this.onAdd();
  }
}
