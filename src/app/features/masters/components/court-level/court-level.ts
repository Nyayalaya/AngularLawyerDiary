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

import { CourtLevel } from '../../models/court-level.model';
import { CourtLevelFacade } from '../../facade/court-level.facade';
import { GenericTable } from '../../../../shared';
import { GenericFormModel } from '../../../../shared/components/generic-form-model/generic-form-model';

@Component({
  selector: 'app-court-level',
  standalone: true,
  templateUrl: './court-level.html',
  styleUrls: ['./court-level.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericTable,
    GenericFormModel
  ]
})
export class CourtLevelComponent implements OnInit {

  // ── DI ────────────────────────────────────────────────────────────
  private fb     = inject(FormBuilder);
  private facade = inject(CourtLevelFacade);

  // ── Store streams ─────────────────────────────────────────────────
  courtLevels$:  Observable<CourtLevel[]>     = this.facade.courtLevels$;
  loading$:      Observable<boolean>          = this.facade.loading$;
  error$:        Observable<string | null>    = this.facade.error$;
  totalRecords$: Observable<number>           = this.facade.totalRecords$;
  pageNumber$:   Observable<number>           = this.facade.pageNumber$;
  pageSize$:     Observable<number>           = this.facade.pageSize$;
  totalPages$:   Observable<number>           = this.facade.totalPages$;

  // ── Local UI state ────────────────────────────────────────────────
  showForm    = signal(false);
  currentPage = signal(1);
  pageSize    = signal(10);
  isEditMode  = signal(false);

  // ── Form ──────────────────────────────────────────────────────────
  courtLevelForm: FormGroup = this.fb.group({
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
    this.facade.load(this.currentPage(), this.pageSize(),true);
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
    this.courtLevelForm.reset({
      id:     '',
      name:   '',
      code:   ''
    });
    this.isEditMode.set(false);
  }

  // ── CRUD handlers ─────────────────────────────────────────────────
  onSubmit(): void {
    if (this.courtLevelForm.invalid) {
      this.courtLevelForm.markAllAsTouched();
      Swal.fire({
        icon:  'warning',
        title: 'Validation Error',
        text:  'Please fill in all required fields correctly.'
      });
      return;
    }

    const formValue = this.courtLevelForm.value;
    const id = formValue.id;

    if (id) {
      // Update existing
      this.facade.update(formValue);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Court Level updated successfully!'
      });
    } else {
      // Create new
      this.facade.add(formValue);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Court Level created successfully!'
      });
    }

    this.toggleForm(true);
  }

  onEdit(item: CourtLevel): void {
    this.isEditMode.set(true);
    this.courtLevelForm.patchValue(item);
    this.showForm.set(true);
  }

  onDelete(item: CourtLevel): void {
    Swal.fire({
      title:  'Delete Confirmation',
      text:   'Are you sure you want to delete this court level?',
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
          'Court Level has been deleted.',
          'success'
        );
      }
    });
  }

  onView(item: CourtLevel): void {
    Swal.fire({
      title:           'Court Level Details',
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
