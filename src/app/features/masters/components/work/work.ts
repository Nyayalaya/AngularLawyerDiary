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
import { NgSelectModule } from '@ng-select/ng-select';

import { Work } from '../../models/work.model';
import { WorkFacade } from '../../facade/work.facade';
import { WorkTypeFacade } from '../../facade/work-type.facade';
import { GenericTable } from '../../../../shared';

interface WorkType {
  id: string;
  name: string;
}

@Component({
  selector: 'app-work',
  standalone: true,
  templateUrl: './work.html',
  styleUrls: ['./work.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    GenericTable
  ]
})
export class WorkComponent implements OnInit {

  private fb            = inject(FormBuilder);
  private facade        = inject(WorkFacade);
  private workTypeFacade = inject(WorkTypeFacade);

  works$:            Observable<Work[]>               = this.facade.works$;
  loading$:          Observable<boolean>              = this.facade.loading$;
  error$:            Observable<string | null>        = this.facade.error$;
  totalRecords$:     Observable<number>               = this.facade.totalRecords$;
  pageNumber$:       Observable<number>               = this.facade.pageNumber$;
  pageSize$:         Observable<number>               = this.facade.pageSize$;
  totalPages$:       Observable<number>               = this.facade.totalPages$;

  workTypes$:        Observable<WorkType[]>           = this.workTypeFacade.workTypes$;

  showForm        = signal(false);
  currentPage     = signal(1);
  pageSize        = signal(10);
  isEditMode      = signal(false);
  allWorkTypes    = signal<WorkType[]>([]);

  workForm: FormGroup = this.fb.group({
    id:       [''],
    workTypeId: ['', Validators.required],
    work:     ['', [Validators.required, Validators.minLength(2)]]
  });

  columns = [
    { key: 'id',         label: 'ID',        hidden: true, isKey: true },
    { key: 'workTypeName', label: 'Work Type' },
    { key: 'work',       label: 'Work' }
  ];

  constructor() {
    this.workTypes$.subscribe(types => {
      this.allWorkTypes.set(types as WorkType[]);
    });
  }

  ngOnInit(): void {
    this.workTypeFacade.load(1, 1000, false);
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
    this.workForm.reset({
      id:       '',
      workTypeId: '',
      work:     ''
    });
    this.isEditMode.set(false);
  }

  onSubmit(): void {
    if (this.workForm.invalid) {
      this.workForm.markAllAsTouched();
      Swal.fire({
        icon:  'warning',
        title: 'Validation Error',
        text:  'Please fill in all required fields correctly.'
      });
      return;
    }

    const formValue = this.workForm.value;
    const id = formValue.id;
    const workTypeId = formValue.workTypeId;

    const workType = this.allWorkTypes().find(wt => wt.id === workTypeId);

    const work: Work = {
      id: id || '',
      workTypeId: workTypeId,
      workTypeName: workType?.name || '',
      work: formValue.work,
      translations: []
    };

    if (id) {
      this.facade.update(work);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Work updated successfully!'
      });
    } else {
      this.facade.add(work);
      Swal.fire({
        icon:  'success',
        title: 'Success',
        text:  'Work created successfully!'
      });
    }

    this.toggleForm(true);
  }

  onEdit(item: Work): void {
    this.isEditMode.set(true);
    this.workForm.patchValue({
      id: item.id,
      workTypeId: item.workTypeId,
      work: item.work
    });
    this.showForm.set(true);
  }

  onDelete(item: Work): void {
    Swal.fire({
      title:  'Delete Confirmation',
      text:   'Are you sure you want to delete this work?',
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
          'Work has been deleted.',
          'success'
        );
      }
    });
  }

  onView(item: Work): void {
    Swal.fire({
      title:           'Work Details',
      html:            `<div style="text-align: left;">
                          <p><strong>ID:</strong> ${item.id}</p>
                          <p><strong>Work Type:</strong> ${item.workTypeName || 'N/A'}</p>
                          <p><strong>Work:</strong> ${item.work}</p>
                        </div>`,
      icon:            'info',
      confirmButtonText: 'Close'
    });
  }

  compareWorkTypes(wt1: string, wt2: string): boolean {
    return wt1 === wt2;
  }
}
