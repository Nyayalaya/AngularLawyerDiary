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

import { FormTypeModel } from '../../models/form-type.model';
import { FormTypeFacade } from '../../facade/form-type.facade';
import { GenericTable } from '../../../../shared';
import { GenericFormModel } from '../../../../shared/components/generic-form-model/generic-form-model';

@Component({
  selector: 'app-form-type',
  standalone: true,
  templateUrl: './form-type.html',
  styleUrls: ['./form-type.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericTable,
    GenericFormModel
  ]
})
export class FormTypeComponent implements OnInit {

  // ── DI ────────────────────────────────────────────────────────────
  private fb     = inject(FormBuilder);
  private facade = inject(FormTypeFacade);

  // ── Store streams ─────────────────────────────────────────────────
  formTypes$:    Observable<FormTypeModel[]>   = this.facade.formTypes$;
  loading$:      Observable<boolean>           = this.facade.loading$;
  error$:        Observable<string | null>     = this.facade.error$;
  totalRecords$: Observable<number>            = this.facade.totalRecords$;
  pageNumber$:   Observable<number>            = this.facade.pageNumber$;
  pageSize$:     Observable<number>            = this.facade.pageSize$;
  totalPages$:   Observable<number>            = this.facade.totalPages$;

  // ── Local UI state ────────────────────────────────────────────────
  showForm    = signal(false);
  currentPage = signal(1);
  pageSize    = signal(10);
  isEditMode  = signal(false);

  // ── Form ──────────────────────────────────────────────────────────
  formTypeForm: FormGroup = this.fb.group({
    id:           [''],
    name:         ['', [Validators.required, Validators.minLength(2)]],
    code:         ['', [Validators.required, Validators.minLength(2)]],
    description:  [''],
    displayOrder: ['', [Validators.required]],
    isactive:     [true]
  });

  // ── Table columns ─────────────────────────────────────────────────
  columns = [
    { key: 'id',           label: 'ID',            hidden: true, isKey: true },
    { key: 'name',         label: 'Name' },
    { key: 'code',         label: 'Code' },
    { key: 'description',  label: 'Description' },
    { key: 'displayOrder', label: 'Display Order' },
    { key: 'isactive',     label: 'Active' }
  ];

  // ── Lifecycle ─────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadPage();
  }

  // ── Pagination ────────────────────────────────────────────────────
  loadPage(): void {
    this.facade.load(this.currentPage(), this.pageSize(), true);
  }

  onPageChanged(event: { page: number; pageSize: number }): void {
    this.currentPage.set(event.page);
    this.pageSize.set(event.pageSize);
    this.facade.load(event.page, event.pageSize, true);
  }

  // ── Form helpers ──────────────────────────────────────────────────
  toggleForm(reset = true): void {
    this.showForm.update(v => !v);
    if (reset) this.resetForm();
  }

  resetForm(): void {
    this.formTypeForm.reset({
      id:           '',
      name:         '',
      code:         '',
      description:  '',
      displayOrder: '',
      isactive:     true
    });
    this.isEditMode.set(false);
  }

  // ── CRUD handlers ─────────────────────────────────────────────────
  onSubmit(): void {
    if (this.formTypeForm.invalid) {
      this.formTypeForm.markAllAsTouched();
      Swal.fire({
        icon:  'warning',
        title: 'Validation Error',
        text:  'Please fill in all required fields correctly.'
      });
      return;
    }

    const formValue = this.formTypeForm.value;
    const id = formValue.id;

    if (id) {
      // Update existing
      this.facade.update(formValue);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Form Type updated successfully!'
      });
    } else {
      // Create new
      this.facade.add(formValue);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Form Type created successfully!'
      });
    }

    this.toggleForm(true);
  }

  onEdit(item: FormTypeModel): void {
    this.isEditMode.set(true);
    this.formTypeForm.patchValue(item);
    this.showForm.set(true);
  }

  onDelete(item: FormTypeModel): void {
    Swal.fire({
      title:  'Delete Confirmation',
      text:   'Are you sure you want to delete this form type?',
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
          'Form Type has been deleted.',
          'success'
        );
      }
    });
  }

  onView(item: FormTypeModel): void {
    Swal.fire({
      title:           'Form Type Details',
      html:            `<div style="text-align: left;">
                          <p><strong>ID:</strong> ${item.id}</p>
                          <p><strong>Name:</strong> ${item.name}</p>
                          <p><strong>Code:</strong> ${item.code}</p>
                          <p><strong>Description:</strong> ${item.description || 'N/A'}</p>
                          <p><strong>Display Order:</strong> ${item.displayOrder}</p>
                          <p><strong>Active:</strong> ${item.isactive ? 'Yes' : 'No'}</p>
                        </div>`,
      icon:            'info',
      confirmButtonText: 'Close'
    });
  }
}
