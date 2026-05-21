import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { GenericTable } from '../../../shared/components/generic-table/generic-table';
import { GenericFormModel } from '../../../shared/components/generic-form-model/generic-form-model';

interface ProceedingWorkMaster {
  id?: number;
  name: string;
  description?: string;
  status: string;
}

@Component({
  selector: 'app-proceeding-work',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericTable,
    GenericFormModel
  ],
  templateUrl: './proceeding-work.html',
  styleUrls: ['./proceeding-work.css']
})
export class ProceedingWorkComponent implements OnInit {

  private fb = inject(FormBuilder);

  showModal = false;

  columns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' }
  ];

  // ✅ Dummy Data
  data: ProceedingWorkMaster[] = [];

  form = this.fb.nonNullable.group({
    id: [0],
    name: ['', Validators.required],
    description: [''],
    status: ['Active']
  });

  ngOnInit(): void {
    this.loadData();
  }

  // ✅ Load Dummy Data
  loadData(): void {
    this.data = [
      { id: 1, name: 'Proceeding Type A', description: 'Main proceeding', status: 'Active' },
      { id: 2, name: 'Work Type B', description: 'Regular work', status: 'Active' },
      { id: 3, name: 'Work Activity C', description: 'Support activity', status: 'Inactive' }
    ];
  }

  // ✅ ADD
  onAdd(): void {
    this.form.reset({
      id: 0,
      name: '',
      description: '',
      status: 'Active'
    });
    this.showModal = true;
  }

  // ✅ EDIT
  onEdit(row: ProceedingWorkMaster): void {
    this.form.patchValue(row);
    this.showModal = true;
  }

  // ✅ VIEW
  onView(row: ProceedingWorkMaster): void {
    alert(JSON.stringify(row, null, 2));
  }

  // ✅ DELETE
  onDelete(row: ProceedingWorkMaster): void {
    if (!row.id) return;

    if (confirm('Are you sure you want to delete this item?')) {
      this.data = this.data.filter(x => x.id !== row.id);
    }
  }

  // ✅ SAVE (ADD + UPDATE)
  save(): void {
    if (this.form.invalid) {
      alert('Please fill all required fields');
      return;
    }

    const value: ProceedingWorkMaster = this.form.getRawValue();

    // 🔥 UPDATE
    if (value.id && value.id !== 0) {
      this.data = this.data.map(x =>
        x.id === value.id ? { ...x, ...value } : x
      );

    } else {
      // 🔥 CREATE
      const newItem: ProceedingWorkMaster = {
        ...value,
        id: Date.now() // simple unique id
      };

      this.data = [...this.data, newItem];
    }

    this.showModal = false;
  }

  // ✅ CLOSE MODAL
  closeModal(): void {
    this.showModal = false;
  }

  goToAddPage(): void {
    this.onAdd();
  }
}
