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

import { FormMasterModel } from '../../models/form-master.model';
import { FormMasterFacade } from '../../facade/form-master.facade';
import { FormTypeFacade } from '../../facade/form-type.facade';
import { FormTypeModel } from '../../models/form-type.model';
import { GenericTable } from '../../../../shared';
import { GenericFormModel } from '../../../../shared/components/generic-form-model/generic-form-model';

@Component({
  selector: 'app-form-master',
  standalone: true,
  templateUrl: './form-master.html',
  styleUrls: ['./form-master.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericTable,
    GenericFormModel
  ]
})
export class FormMasterComponent implements OnInit {

  // ── DI ────────────────────────────────────────────────────────────
  private fb              = inject(FormBuilder);
  private facade          = inject(FormMasterFacade);
  private formTypeFacade  = inject(FormTypeFacade);

  // ── Store streams ─────────────────────────────────────────────────
  formMasters$:  Observable<FormMasterModel[]>  = this.facade.formMasters$;
  loading$:      Observable<boolean>            = this.facade.loading$;
  error$:        Observable<string | null>      = this.facade.error$;
  totalRecords$: Observable<number>             = this.facade.totalRecords$;
  pageNumber$:   Observable<number>             = this.facade.pageNumber$;
  pageSize$:     Observable<number>             = this.facade.pageSize$;
  totalPages$:   Observable<number>             = this.facade.totalPages$;

  formTypes$:    Observable<FormTypeModel[]>    = this.formTypeFacade.formTypes$;

  // ── Local UI state ────────────────────────────────────────────────
  showForm    = signal(false);
  currentPage = signal(1);
  pageSize    = signal(10);
  isEditMode  = signal(false);

  // ── Form ──────────────────────────────────────────────────────────
  formMasterForm: FormGroup = this.fb.group({
    id:         [''],
    formTypeId: ['', [Validators.required]],
    name:       ['', [Validators.required, Validators.minLength(2)]],
    code:       ['', [Validators.required, Validators.minLength(2)]],
    description: ['']
  });

  // ── Table columns ─────────────────────────────────────────────────
  columns = [
    { key: 'id',         label: 'ID',          hidden: true, isKey: true },
    { key: 'formTypeName', label: 'Form Type' },
    { key: 'name',       label: 'Name' },
    { key: 'code',       label: 'Code' },
    { key: 'description', label: 'Description' }
  ];

  // ── Lifecycle ─────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadPage();
    this.formTypeFacade.load(1, 100); // Load all form types
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
    this.formMasterForm.reset({
      id:         '',
      formTypeId: '',
      name:       '',
      code:       '',
      description: ''
    });
    this.isEditMode.set(false);
  }

  // ── CRUD handlers ─────────────────────────────────────────────────
  onSubmit(): void {
    if (this.formMasterForm.invalid) {
      this.formMasterForm.markAllAsTouched();
      Swal.fire({
        icon:  'warning',
        title: 'Validation Error',
        text:  'Please fill in all required fields correctly.'
      });
      return;
    }

    const formValue = this.formMasterForm.value;
    const id = formValue.id;

    if (id) {
      // Update existing
      this.facade.update(formValue);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Form Master updated successfully!'
      });
    } else {
      // Create new
      this.facade.add(formValue);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Form Master created successfully!'
      });
    }

    this.toggleForm(true);
  }

  onEdit(item: FormMasterModel): void {
    this.isEditMode.set(true);
    this.formMasterForm.patchValue(item);
    this.showForm.set(true);
  }

  onDelete(item: FormMasterModel): void {
    Swal.fire({
      title:  'Delete Confirmation',
      text:   'Are you sure you want to delete this form master?',
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
          'Form Master has been deleted.',
          'success'
        );
      }
    });
  }

  onView(item: FormMasterModel): void {
    Swal.fire({
      title:           'Form Master Details',
      html:            `<div style="text-align: left;">
                          <p><strong>ID:</strong> ${item.id}</p>
                          <p><strong>Form Type:</strong> ${item.formTypeName}</p>
                          <p><strong>Name:</strong> ${item.name}</p>
                          <p><strong>Code:</strong> ${item.code}</p>
                          <p><strong>Description:</strong> ${item.description || 'N/A'}</p>
                        </div>`,
      icon:            'info',
      confirmButtonText: 'Close'
    });
  }
}
