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

import { Cadre } from '../../models/cadre.model';
import { CadreFacade } from '../../facade/cadre.facade';
import { GenericTable } from '../../../../shared';
import { GenericFormModel } from '../../../../shared/components/generic-form-model/generic-form-model';

@Component({
  selector: 'app-cadre',
  standalone: true,
  templateUrl: './cadre.html',
  styleUrls: ['./cadre.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericTable,
    GenericFormModel
  ]
})
export class CadreComponent implements OnInit {

  // ── DI ────────────────────────────────────────────────────────────
  private fb     = inject(FormBuilder);
  private facade = inject(CadreFacade);

  // ── Store streams ─────────────────────────────────────────────────
  cadres$:       Observable<Cadre[]>         = this.facade.cadres$;
  loading$:      Observable<boolean>         = this.facade.loading$;
  error$:        Observable<string | null>   = this.facade.error$;
  totalRecords$: Observable<number>          = this.facade.totalRecords$;
  pageNumber$:   Observable<number>          = this.facade.pageNumber$;
  pageSize$:     Observable<number>          = this.facade.pageSize$;
  totalPages$:   Observable<number>          = this.facade.totalPages$;

  // ── Local UI state ────────────────────────────────────────────────
  showForm    = signal(false);
  currentPage = signal(1);
  pageSize    = signal(10);
  isEditMode  = signal(false);

  // ── Form ──────────────────────────────────────────────────────────
  cadreForm: FormGroup = this.fb.group({
    id:     [''],
    name:   ['', [Validators.required, Validators.minLength(2)]],
    code:   ['', [Validators.required, Validators.minLength(2)]]
  });

  // ── Table columns ─────────────────────────────────────────────────
  columns = [
    { key: 'id',     label: 'ID',     hidden: true, isKey: true },
    { key: 'name',   label: 'Name' },
    { key: 'code',   label: 'Code' }
  ];

  // ── Lifecycle ─────────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadPage();
  }

  // ── Pagination ────────────────────────────────────────────────────
  loadPage(): void {
    this.facade.load(this.currentPage(), this.pageSize());
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
    this.cadreForm.reset({
      id:     '',
      name:   '',
      code:   ''
    });
    this.isEditMode.set(false);
  }

  // ── CRUD handlers ─────────────────────────────────────────────────
  onSubmit(): void {
    if (this.cadreForm.invalid) {
      this.cadreForm.markAllAsTouched();
      Swal.fire({
        icon:  'warning',
        title: 'Validation Error',
        text:  'Please fill in all required fields correctly.'
      });
      return;
    }

    const formValue = this.cadreForm.value;
    const id = formValue.id;

    if (id) {
      // Update existing
      this.facade.update(formValue);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Cadre updated successfully!'
      });
    } else {
      // Create new
      this.facade.add(formValue);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Cadre created successfully!'
      });
    }

    this.toggleForm(true);
  }

  onEdit(item: Cadre): void {
    this.isEditMode.set(true);
    this.cadreForm.patchValue(item);
    this.showForm.set(true);
  }

  onDelete(item: Cadre): void {
    Swal.fire({
      title:  'Delete Confirmation',
      text:   'Are you sure you want to delete this cadre?',
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
          'Cadre has been deleted.',
          'success'
        );
      }
    });
  }

  onView(item: Cadre): void {
    Swal.fire({
      title:           'Cadre Details',
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
