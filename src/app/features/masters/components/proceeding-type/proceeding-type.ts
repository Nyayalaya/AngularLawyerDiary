import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

import { ProceedingType } from '../../models/proceeding-type.model';
import { ProceedingTypeFacade } from '../../facade/proceeding-type.facade';
import { GenericTable } from '../../../../shared';
import { GenericFormModel } from '../../../../shared/components/generic-form-model/generic-form-model';

@Component({
  selector: 'app-proceeding-type',
  standalone: true,
  templateUrl: './proceeding-type.html',
  styleUrls: ['./proceeding-type.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericTable,
    GenericFormModel
  ]
})
export class ProceedingTypeComponent implements OnInit {

  private fb     = inject(FormBuilder);
  private facade = inject(ProceedingTypeFacade);

  proceedingTypes$:  Observable<ProceedingType[]>      = this.facade.proceedingTypes$;
  loading$:          Observable<boolean>               = this.facade.loading$;
  error$:            Observable<string | null>         = this.facade.error$;
  totalRecords$:     Observable<number>                = this.facade.totalRecords$;
  pageNumber$:       Observable<number>                = this.facade.pageNumber$;
  pageSize$:         Observable<number>                = this.facade.pageSize$;
  totalPages$:       Observable<number>                = this.facade.totalPages$;

  showForm    = signal(false);
  currentPage = signal(1);
  pageSize    = signal(10);
  isEditMode  = signal(false);

  proceedingTypeForm: FormGroup = this.fb.group({
    id:     [''],
    name:   ['', [Validators.required, Validators.minLength(2)]],
    code:   ['', [Validators.required, Validators.minLength(2)]]
  });

  columns = [
    { key: 'id',     label: 'ID',     hidden: true, isKey: true },
    { key: 'name',   label: 'Name' },
    { key: 'code',   label: 'Code' }
  ];

  ngOnInit(): void {
    this.loadPage();
  }

  loadPage(): void {
    this.facade.load(this.currentPage(), this.pageSize());
  }

  onPageChanged(event: { page: number; pageSize: number }): void {
    this.currentPage.set(event.page);
    this.pageSize.set(event.pageSize);
    this.facade.load(event.page, event.pageSize, true);
  }

  toggleForm(reset = true): void {
    this.showForm.update(v => !v);
    if (reset) this.resetForm();
  }

  resetForm(): void {
    this.proceedingTypeForm.reset({
      id:     '',
      name:   '',
      code:   ''
    });
    this.isEditMode.set(false);
  }

  onSubmit(): void {
    if (this.proceedingTypeForm.invalid) {
      this.proceedingTypeForm.markAllAsTouched();
      Swal.fire({
        icon:  'warning',
        title: 'Validation Error',
        text:  'Please fill in all required fields correctly.'
      });
      return;
    }

    const formValue = this.proceedingTypeForm.value;
    const id = formValue.id;

    if (id) {
      this.facade.update(formValue);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Proceeding Type updated successfully!'
      });
    } else {
      this.facade.add(formValue);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Proceeding Type created successfully!'
      });
    }

    this.toggleForm(true);
  }

  onEdit(item: ProceedingType): void {
    this.isEditMode.set(true);
    this.proceedingTypeForm.patchValue(item);
    this.showForm.set(true);
  }

  onDelete(item: ProceedingType): void {
    Swal.fire({
      title:  'Delete Confirmation',
      text:   'Are you sure you want to delete this proceeding type?',
      icon:   'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor:  '#d33',
      confirmButtonText:  'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.facade.delete(item.id);
        Swal.fire(
          'Deleted!',
          'Proceeding Type has been deleted.',
          'success'
        );
      }
    });
  }

  onView(item: ProceedingType): void {
    Swal.fire({
      title:           'Proceeding Type Details',
      html:            `<div style="text-align: left;">
                          <p><strong>ID:</strong> ${item.id}</p>
                          <p><strong>Name:</strong> ${item.name}</p>
                          <p><strong>Code:</strong> ${item.code}</p>
                        </div>`,
      icon:            'info',
      confirmButtonText: 'Close'
    });
  }
}
