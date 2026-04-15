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

import { CaseCategory } from '../../models/case-category.model';
import { CaseCategoryFacade } from '../../facade/case-category.facade';
import { CourtTypeFacade } from '../../facade/court-type.facade';
import { CourtTypeModel } from '../../models/court-type.model';
import { GenericTable } from '../../../../shared';
import { GenericFormModel } from '../../../../shared/components/generic-form-model/generic-form-model';

@Component({
  selector: 'app-case-category',
  standalone: true,
  templateUrl: './case-category.html',
  styleUrls: ['./case-category.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GenericTable,
    GenericFormModel
  ]
})
export class CaseCategoryComponent implements OnInit {

  // ── DI ────────────────────────────────────────────────────────────
  private fb     = inject(FormBuilder);
  private facade = inject(CaseCategoryFacade);
  private courtTypeFacade = inject(CourtTypeFacade);

  // ── Store streams ─────────────────────────────────────────────────
  caseCategories$: Observable<CaseCategory[]>   = this.facade.caseCategories$;
  courtTypes$:     Observable<CourtTypeModel[]> = this.courtTypeFacade.courtTypes$;
  loading$:        Observable<boolean>          = this.facade.loading$;
  error$:          Observable<string | null>    = this.facade.error$;
  totalRecords$:   Observable<number>           = this.facade.totalRecords$;
  pageNumber$:     Observable<number>           = this.facade.pageNumber$;
  pageSize$:       Observable<number>           = this.facade.pageSize$;
  totalPages$:     Observable<number>           = this.facade.totalPages$;

  // ── Local UI state ────────────────────────────────────────────────
  showForm    = signal(false);
  currentPage = signal(1);
  pageSize    = signal(10);
  isEditMode  = signal(false);

  // ── Form ──────────────────────────────────────────────────────────
  caseCategoryForm: FormGroup = this.fb.group({
    id:           [''],
    name:         ['', [Validators.required, Validators.minLength(2)]],
    courtTypeId:  ['', [Validators.required]]
  });

  // ── Table columns ─────────────────────────────────────────────────
  columns = [
    { key: 'id',              label: 'ID',         hidden: true, isKey: true },
    { key: 'name',            label: 'Name' },
    { key: 'courtTypeName',   label: 'Court Type' }
  ];

  // ── Lifecycle ─────────────────────────────────────────────────────
  ngOnInit(): void {
    this.courtTypeFacade.load(1, 100, true);
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
    this.caseCategoryForm.reset({
      id:           '',
      name:         '',
      courtTypeId:  ''
    });
    this.isEditMode.set(false);
  }

  // ── CRUD handlers ─────────────────────────────────────────────────
  onSubmit(): void {
    if (this.caseCategoryForm.invalid) {
      this.caseCategoryForm.markAllAsTouched();
      Swal.fire({
        icon:  'warning',
        title: 'Validation Error',
        text:  'Please fill in all required fields correctly.'
      });
      return;
    }

    const formValue = this.caseCategoryForm.value;
    const id = formValue.id;

    if (id) {
      // Update existing
      this.facade.update(formValue);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Case Category updated successfully!'
      });
    } else {
      // Create new
      this.facade.add(formValue);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Case Category created successfully!'
      });
    }

    this.toggleForm(true);
  }

  onEdit(item: CaseCategory): void {
    this.isEditMode.set(true);
    this.caseCategoryForm.patchValue({
      id: item.id,
      name: item.name,
      courtTypeId: item.courtTypeId
    });
    this.showForm.set(true);
  }

  onDelete(item: CaseCategory): void {
    Swal.fire({
      title:  'Delete Confirmation',
      text:   'Are you sure you want to delete this case category?',
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
          'Case Category has been deleted.',
          'success'
        );
      }
    });
  }

  onView(item: CaseCategory): void {
    Swal.fire({
      title:           'Case Category Details',
      html:            `<div style="text-align: left;">
                          <p><strong>ID:</strong> ${item.id}</p>
                          <p><strong>Name:</strong> ${item.name}</p>
                          <p><strong>Court Type:</strong> ${item.courtTypeName || 'N/A'}</p>
                        </div>`,
      icon:            'info',
      confirmButtonText: 'Close'
    });
  }
}

