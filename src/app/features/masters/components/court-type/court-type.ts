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

import { CourtTypeModel } from '../../models/court-type.model';
import { CourtTypeFacade } from '../../facade/court-type.facade';
import { GenericTable } from '../../../../shared';
import { GenericFormModel } from '../../../../shared/components/generic-form-model/generic-form-model';

@Component({
  selector: 'app-court-type',
  standalone: true,
  templateUrl: './court-type.html',
  styleUrls: ['./court-type.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericTable,
    GenericFormModel
  ]
})
export class CourtTypeComponent implements OnInit {

  // ── DI ────────────────────────────────────────────────────────────
  private fb     = inject(FormBuilder);
  private facade = inject(CourtTypeFacade);

  // ── Store streams ─────────────────────────────────────────────────
  courtTypes$:   Observable<CourtTypeModel[]> = this.facade.courtTypes$;
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

  // ── Form ──────────────────────────────────────────────────────────
  courtTypeForm: FormGroup = this.fb.group({
    id:           [''],
    name:    ['', [Validators.required, Validators.minLength(2)]],
    code: ['', [Validators.required, Validators.minLength(2)]]
  });

  // ── Table columns ─────────────────────────────────────────────────
  columns = [
    { key: 'id',           label: 'ID',           hidden: true, isKey: true },
    { key: 'name',    label: 'Name'                               },
    { key: 'code', label: 'Code'                             }
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
    this.facade.load(event.page, event.pageSize);
  }

  // ── Form helpers ──────────────────────────────────────────────────
  toggleForm(reset = true): void {
    this.showForm.update(v => !v);
    if (reset) this.resetForm();
  }

  resetForm(): void {
    this.courtTypeForm.reset({
      id:           '',
      name:    '',
      code: ''
    });
  }

  // ── CRUD handlers ─────────────────────────────────────────────────
  onSubmit(): void {
    if (this.courtTypeForm.invalid) {
      this.courtTypeForm.markAllAsTouched();
      Swal.fire({
        icon:               'warning',
        title:              'Validation Error',
        text:               'Please fill in all required fields correctly.',
        confirmButtonColor: '#3085d6'
      });
      return;
    }

    const model: CourtTypeModel = this.courtTypeForm.value;

    if (model.id) {
      this.facade.update(model);
      Swal.fire({
        icon:               'success',
        title:              'Updated!',
        text:               `"${model.name}" has been updated successfully.`,
        timer:              2000,
        timerProgressBar:   true,
        showConfirmButton:  false
      });
    } else {
      this.facade.add(model);
      Swal.fire({
        icon:               'success',
        title:              'Added!',
        text:               `"${model.name}" has been added successfully.`,
        timer:              2000,
        timerProgressBar:   true,
        showConfirmButton:  false
      });
    }

    this.showForm.set(false);
    this.resetForm();
  }

  onEdit(row: CourtTypeModel): void {
    this.courtTypeForm.patchValue(row);
    this.showForm.set(true);
  }

  onDelete(row: CourtTypeModel): void {
    Swal.fire({
      icon:               'warning',
      title:              'Are you sure?',
      text:               `You are about to delete "${row.name}". This cannot be undone.`,
      showCancelButton:   true,
      confirmButtonColor: '#d33',
      cancelButtonColor:  '#6c757d',
      confirmButtonText:  'Yes, Delete',
      cancelButtonText:   'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.facade.delete(row.id);
        Swal.fire({
          icon:              'success',
          title:             'Deleted!',
          text:              `"${row.name}" has been deleted successfully.`,
          timer:             2000,
          timerProgressBar:  true,
          showConfirmButton: false
        });
      }
    });
  }

  onView(row: CourtTypeModel): void {
    Swal.fire({
      icon:               'info',
      title:              'Court Type Details',
      confirmButtonColor: '#3085d6',
      confirmButtonText:  'Close',
      html: `
        <table style="width:100%;text-align:left;border-collapse:collapse;">
          <thead>
            <tr style="background:#f8f9fa;">
              <th style="padding:10px 12px;border-bottom:2px solid #dee2e6;">Field</th>
              <th style="padding:10px 12px;border-bottom:2px solid #dee2e6;">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding:10px 12px;border-bottom:1px solid #dee2e6;">
                <strong>Court Type</strong>
              </td>
              <td style="padding:10px 12px;border-bottom:1px solid #dee2e6;">
                ${row.name}
              </td>
            </tr>
            <tr>
              <td style="padding:10px 12px;">
                <strong>Abbreviation</strong>
              </td>
              <td style="padding:10px 12px;">
                ${row.code}
              </td>
            </tr>
          </tbody>
        </table>
      `
    });
  }

  refresh(): void {
    this.currentPage.set(1);
    this.loadPage();
    Swal.fire({
      icon:              'success',
      title:             'Refreshed!',
      text:              'Court types list has been refreshed.',
      timer:             1500,
      timerProgressBar:  true,
      showConfirmButton: false
    });
  }
}