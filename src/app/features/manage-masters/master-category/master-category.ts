import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';

import { GenericTable } from '../../../shared/components/generic-table/generic-table';
import { GenericFormModel } from '../../../shared/components/generic-form-model/generic-form-model';

@Component({
  selector: 'app-master-category',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericTable,
    GenericFormModel
  ],
  templateUrl: './master-category.html',
  styleUrls: ['./master-category.css']
})
export class MasterCategory {

  private fb = inject(FormBuilder);
  showModal = false;

  columns = [
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
    { key: 'status', label: 'Status' }
  ];

  data = [
    { id: 1, name: 'Civil', description: 'Civil cases', status: 'Active' },
    { id: 2, name: 'Criminal', description: 'Criminal matters', status: 'Active' },
    { id: 3, name: 'Tax', description: 'Tax disputes', status: 'Inactive' }
  ];


  form = this.fb.group({
    id: [0],
     name: ['', Validators.required], 
    description: [''],
    status: ['Active']
  });


  onAdd() {
    this.form.reset({ status: 'Active' });
    this.showModal = true;
  }



  onEdit(row: any) {
    this.form.patchValue(row);
    this.showModal = true;
  }



  onView(row: any) {
    alert(JSON.stringify(row, null, 2));
  }


  

  onDelete(row: any) {
    this.data = this.data.filter(x => x.id !== row.id);
  }


  

  save(value: any) {

    if (value.id) {
      // EDIT
      this.data = this.data.map(x =>
        x.id === value.id ? value : x
      );
    } else {
      // ADD
      this.data = [
        ...this.data,
        { ...value, id: Date.now() }
      ];
    }

    this.showModal = false;
  }


  /* ================= PAGE MODE (optional) ================= */

  goToAddPage() {
    console.log('Navigate to page here');
  }
}
