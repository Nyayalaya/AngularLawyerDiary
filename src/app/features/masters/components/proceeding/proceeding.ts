import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';

import { Proceeding } from '../../models/proceeding.model';
import { ProceedingFacade } from '../../facade/proceeding.facade';
import { ProceedingTypeFacade } from '../../facade/proceeding-type.facade';
import { GenericTable } from '../../../../shared';

interface ProceedingType {
  id: string;
  name: string;
}

@Component({
  selector: 'app-proceeding',
  standalone: true,
  templateUrl: './proceeding.html',
  styleUrls: ['./proceeding.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    GenericTable
  ]
})
export class ProceedingComponent implements OnInit {

  private fb                   = inject(FormBuilder);
  private facade               = inject(ProceedingFacade);
  private proceedingTypeFacade = inject(ProceedingTypeFacade);

  proceedings$:      Observable<Proceeding[]>         = this.facade.proceedings$;
  loading$:          Observable<boolean>              = this.facade.loading$;
  error$:            Observable<string | null>        = this.facade.error$;
  totalRecords$:     Observable<number>               = this.facade.totalRecords$;
  pageNumber$:       Observable<number>               = this.facade.pageNumber$;
  pageSize$:         Observable<number>               = this.facade.pageSize$;
  totalPages$:       Observable<number>               = this.facade.totalPages$;

  proceedingTypes$:  Observable<ProceedingType[]>     = this.proceedingTypeFacade.proceedingTypes$;

  showForm        = signal(false);
  currentPage     = signal(1);
  pageSize        = signal(10);
  isEditMode      = signal(false);
  allProceedingTypes = signal<ProceedingType[]>([]);

  proceedingForm: FormGroup = this.fb.group({
    id:               [''],
    proceedingTypeId: ['', Validators.required],
    proceeding:       ['', [Validators.required, Validators.minLength(2)]]
  });

  columns = [
    { key: 'id',                 label: 'ID',                 hidden: true, isKey: true },
    { key: 'proceedingType', label: 'Proceeding Type' },
    { key: 'name',         label: 'Proceeding' }
  ];

  constructor() {
    this.proceedingTypes$.subscribe(types => {
      this.allProceedingTypes.set(types as ProceedingType[]);
    });
  }

  ngOnInit(): void {
    this.proceedingTypeFacade.load(1, 1000, false);
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
    this.proceedingForm.reset({
      id:               '',
      proceedingTypeId: '',
      proceeding:       ''
    });
    this.isEditMode.set(false);
  }

  onSubmit(): void {
    if (this.proceedingForm.invalid) {
      this.proceedingForm.markAllAsTouched();
      Swal.fire({
        icon:  'warning',
        title: 'Validation Error',
        text:  'Please fill in all required fields correctly.'
      });
      return;
    }

    const formValue = this.proceedingForm.value;
    const id = formValue.id;
    const proceedingTypeId = formValue.proceedingTypeId;

    const proceedingType = this.allProceedingTypes().find(pt => pt.id === proceedingTypeId);

    const proceeding: Proceeding = {
      id: id || '',
      proceedingTypeId: proceedingTypeId,
      proceedingType: proceedingType?.name || '',
      name: formValue.name,
      code: formValue.code || '',
      translations: []
    };

    if (id) {
      this.facade.update(proceeding);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Proceeding updated successfully!'
      });
    } else {
      this.facade.add(proceeding);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Proceeding created successfully!'
      });
    }

    this.toggleForm(true);
  }

  onEdit(item: Proceeding): void {
    this.isEditMode.set(true);
    this.proceedingForm.patchValue({
      id: item.id,
      proceedingTypeId: item.proceedingTypeId,
      proceeding: item.name
    });
    this.showForm.set(true);
  }

  onDelete(item: Proceeding): void {
    Swal.fire({
      title:  'Delete Confirmation',
      text:   'Are you sure you want to delete this proceeding?',
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
          'Proceeding has been deleted.',
          'success'
        );
      }
    });
  }

  onView(item: Proceeding): void {
    Swal.fire({
      title:           'Proceeding Details',
      html:            `<div style="text-align: left;">
                          <p><strong>ID:</strong> ${item.id}</p>
                          <p><strong>Proceeding Type:</strong> ${item.proceedingType || 'N/A'}</p>
                          <p><strong>Proceeding:</strong> ${item.name}</p>
                          <p><strong>Code:</strong> ${item.code || 'N/A'}</p>
                        </div>`,
      icon:            'info',
      confirmButtonText: 'Close'
    });
  }

  compareProceedingTypes(pt1: string, pt2: string): boolean {
    return pt1 === pt2;
  }
}
