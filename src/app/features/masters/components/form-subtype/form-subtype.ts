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

import { FormSubTypeModel } from '../../models/form-sub-type-model';
import { FormSubTypeFacade } from '../../facade/form-subtype.facade';
import { FormMasterFacade } from '../../facade/form-master.facade';
import { FormMasterModel } from '../../models/form-master.model';
import { GenericTable } from '../../../../shared';
import { GenericFormModel } from '../../../../shared/components/generic-form-model/generic-form-model';

@Component({
  selector: 'app-form-subtype',
  standalone: true,
  templateUrl: './form-subtype.html',
  styleUrls: ['./form-subtype.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericTable,
    GenericFormModel
  ]
})
export class FormSubTypeComponent implements OnInit {

  // ── DI ────────────────────────────────────────────────────────────
  private fb                = inject(FormBuilder);
  private facade            = inject(FormSubTypeFacade);
  private formMasterFacade  = inject(FormMasterFacade);

  // ── Store streams ─────────────────────────────────────────────────
  formSubTypes$: Observable<FormSubTypeModel[]>  = this.facade.formSubTypes$;
  loading$:      Observable<boolean>             = this.facade.loading$;
  error$:        Observable<string | null>       = this.facade.error$;
  totalRecords$: Observable<number>              = this.facade.totalRecords$;
  pageNumber$:   Observable<number>              = this.facade.pageNumber$;
  pageSize$:     Observable<number>              = this.facade.pageSize$;
  totalPages$:   Observable<number>              = this.facade.totalPages$;

  formMasters$:  Observable<FormMasterModel[]>   = this.formMasterFacade.formMasters$;

  // ── Local UI state ────────────────────────────────────────────────
  showForm    = signal(false);
  currentPage = signal(1);
  pageSize    = signal(10);
  isEditMode  = signal(false);

  // ── Form ──────────────────────────────────────────────────────────
  formSubTypeForm: FormGroup = this.fb.group({
    id:          [''],
    formId:      ['', [Validators.required]],
    name:        ['', [Validators.required, Validators.minLength(2)]],
    code:        ['', [Validators.required, Validators.minLength(2)]],
    description: ['']
  });

  // ── Table columns ─────────────────────────────────────────────────
  columns = [
    { key: 'id',          label: 'ID',         hidden: true, isKey: true },
    { key: 'formId',      label: 'Form ID' },
    { key: 'name',        label: 'Name' },
    { key: 'code',        label: 'Code' },
    { key: 'description', label: 'Description' }
  ];

  // ── Lifecycle ─────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadPage();
    this.formMasterFacade.load(1, 100); // Load all form masters
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
    this.formSubTypeForm.reset({
      id:          '',
      formId:      '',
      name:        '',
      code:        '',
      description: ''
    });
    this.isEditMode.set(false);
  }

  // ── CRUD handlers ─────────────────────────────────────────────────
  onSubmit(): void {
    if (this.formSubTypeForm.invalid) {
      this.formSubTypeForm.markAllAsTouched();
      Swal.fire({
        icon:  'warning',
        title: 'Validation Error',
        text:  'Please fill in all required fields correctly.'
      });
      return;
    }

    const formValue = this.formSubTypeForm.value;
    const id = formValue.id;

    if (id) {
      // Update existing
      this.facade.update(formValue);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Form SubType updated successfully!'
      });
    } else {
      // Create new
      this.facade.add(formValue);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Form SubType created successfully!'
      });
    }

    this.toggleForm(true);
  }

  onEdit(item: FormSubTypeModel): void {
    this.isEditMode.set(true);
    this.formSubTypeForm.patchValue(item);
    this.showForm.set(true);
  }

  onDelete(item: FormSubTypeModel): void {
    Swal.fire({
      title:  'Delete Confirmation',
      text:   'Are you sure you want to delete this form subtype?',
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
          'Form SubType has been deleted.',
          'success'
        );
      }
    });
  }

  onView(item: FormSubTypeModel): void {
    Swal.fire({
      title:           'Form SubType Details',
      html:            `<div style="text-align: left;">
                          <p><strong>ID:</strong> ${item.id}</p>
                          <p><strong>Form ID:</strong> ${item.formId}</p>
                          <p><strong>Name:</strong> ${item.name}</p>
                          <p><strong>Code:</strong> ${item.code}</p>
                          <p><strong>Description:</strong> ${item.description || 'N/A'}</p>
                        </div>`,
      icon:            'info',
      confirmButtonText: 'Close'
    });
  }
}
