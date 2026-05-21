import { Component, OnInit, OnDestroy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';

import { CourtComplex } from '../../models/court-complex.model';
import { Court } from '../../models/court.model';
import { StateModel } from '../../models/state.model';
import { CourtDistrict } from '../../models/court-district.model';

import { CourtComplexFacade } from '../../facade/court-complex.facade';
import { CourtFacade } from '../../facade/court.facade';
import { StateFacade } from '../../facade/state.facade';
import { CourtDistrictFacade } from '../../facade/court-district.facade';
import { GenericTable } from '../../../../shared';

import { CreateCourtComplexDto } from '../../dtos/court-complex.dto';

@Component({
  selector: 'app-court-complex',
  standalone: true,
  templateUrl: './court-complex.html',
  styleUrls: ['./court-complex.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    GenericTable
  ]
})
export class CourtComplexComponent implements OnInit, OnDestroy {

  // ── DI ────────────────────────────────────────────────────────────
  private fb = inject(FormBuilder);
  private courtComplexFacade = inject(CourtComplexFacade);
  private courtFacade = inject(CourtFacade);
  private stateFacade = inject(StateFacade);
  private courtDistrictFacade = inject(CourtDistrictFacade);
  private destroy$ = new Subject<void>();

  // ── Store streams ─────────────────────────────────────────────────
  courtComplexes$: Observable<CourtComplex[]> = this.courtComplexFacade.courtComplexes$;
  loading$: Observable<boolean> = this.courtComplexFacade.loading$;
  error$: Observable<string | null> = this.courtComplexFacade.error$;
  totalRecords$: Observable<number> = this.courtComplexFacade.totalRecords$;
  pagination$: Observable<any> = this.courtComplexFacade.pagination$;
  pageNumber$ = this.pagination$.pipe(map(p => p?.pageNumber ?? 1));
  pageSize$ = this.pagination$.pipe(map(p => p?.pageSize ?? 10));
  totalPages$ = this.pagination$.pipe(map(p => p?.totalPages ?? 0));

  // ── Dropdown data ─────────────────────────────────────────────────
  courts$: Observable<Court[]> = this.courtFacade.courts$.pipe(
    map(courts => courts || [])
  );
  states$: Observable<StateModel[]> = this.stateFacade.states$.pipe(
    map(states => states || [])
  );
  courtDistricts$: Observable<CourtDistrict[]> = this.courtDistrictFacade.courtDistricts$.pipe(
    map(districts => districts || [])
  );

  // ── Local UI state ────────────────────────────────────────────────
  showForm = signal(false);
  currentPage = signal(1);
  pageSize = signal(10);
  isEditMode = signal(false);
  selectedCourt = signal<Court | null>(null);
  selectedState = signal<StateModel | null>(null);
  filteredDistricts = signal<CourtDistrict[]>([]);
  allCourts = signal<Court[]>([]);
  allStates = signal<StateModel[]>([]);
  allDistricts = signal<CourtDistrict[]>([]);
  currentComplexId = signal<string | null>(null);

  // ── Form ──────────────────────────────────────────────────────────
  complexForm: FormGroup = this.fb.group({
    courtId: ['', Validators.required],
    stateId: ['', Validators.required],
    courtDistrictId: [''],
    name: ['', [Validators.required, Validators.minLength(2)]],
    code: ['', [Validators.required, Validators.minLength(1)]],
    address: ['', [Validators.required, Validators.minLength(5)]],
    isVirtualComplex: [false]
  });

  // ── Table columns ─────────────────────────────────────────────────
  columns = [
    { key: 'id', label: 'ID', hidden: true, isKey: true },
    { key: 'courtName', label: 'Court' },
    { key: 'stateName', label: 'State' },
    { key: 'courtDistrictName', label: 'District' },
    { key: 'name', label: 'Complex Name' },
    { key: 'code', label: 'Code' },
    { key: 'address', label: 'Address' },
    { key: 'isVirtualComplex', label: 'Is Virtual' }
  ];

  constructor() {
    // Subscribe to dropdown data with proper cleanup
    this.courts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(courts => {
        this.allCourts.set(courts);
      });

    this.states$
      .pipe(takeUntil(this.destroy$))
      .subscribe(states => {
        this.allStates.set(states);
      });

    this.courtDistricts$
      .pipe(takeUntil(this.destroy$))
      .subscribe(districts => {
        this.allDistricts.set(districts);
        // Re-filter districts when they load
        this.filterDistrictsByState();
      });

    // Effect to filter districts based on selected state
    effect(() => {
      this.selectedState();
      this.filterDistrictsByState();
    });
  }

  // ── Helper method to filter districts ──────────────────────────────
  private filterDistrictsByState(): void {
    const stateId = this.selectedState()?.id;
    if (stateId) {
      const filtered = this.allDistricts().filter(d => d.stateId === stateId);
      this.filteredDistricts.set(filtered);
    } else {
      this.filteredDistricts.set([]);
    }
  }

  // ── Lifecycle - Cleanup ───────────────────────────────────────────
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Lifecycle ─────────────────────────────────────────────────────
  ngOnInit(): void {
    this.courtFacade.loadCourts(1, 1000);
    this.stateFacade.load(1, 1000, false);
    this.courtDistrictFacade.load(1, 1000, false);
    
    this.loadPage();
  }

  // ── Pagination ────────────────────────────────────────────────────
  loadPage(): void {
    this.courtComplexFacade.loadCourtComplexes(this.currentPage(), this.pageSize());
  }

  onPageChanged(event: { page: number; pageSize: number }): void {
    this.currentPage.set(event.page);
    this.pageSize.set(event.pageSize);
    this.courtComplexFacade.loadCourtComplexes(event.page, event.pageSize);
  }

  // ── Form helpers ──────────────────────────────────────────────────
  toggleForm(reset = true): void {
    this.showForm.update(v => !v);
    if (reset) this.resetForm();
  }

  goBackToList(): void {
    this.showForm.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.complexForm.reset({
      courtId: '',
      stateId: '',
      courtDistrictId: '',
      name: '',
      code: '',
      address: '',
      isVirtualComplex: false
    });
    this.selectedCourt.set(null);
    this.selectedState.set(null);
    this.filteredDistricts.set([]);
    this.isEditMode.set(false);
    this.currentComplexId.set(null);
  }

  // ── Court Selection ───────────────────────────────────────────────
  onCourtSelected(courtId: string): void {
    const court = this.allCourts().find(c => c.id === courtId);
    this.selectedCourt.set(court || null);
  }

  // ── State Selection ───────────────────────────────────────────────
  onStateSelected(stateId: string | number | null): void {
    if (!stateId && stateId !== 0) {
      this.selectedState.set(null);
      this.filteredDistricts.set([]);
      this.complexForm.get('courtDistrictId')?.setValue('');
      return;
    }

    const numStateId = typeof stateId === 'string' ? parseInt(stateId, 10) : stateId;
    if (isNaN(numStateId)) {
      this.selectedState.set(null);
      this.filteredDistricts.set([]);
      this.complexForm.get('courtDistrictId')?.setValue('');
      return;
    }

    const state = this.allStates().find(s => s.id === numStateId);
    this.selectedState.set(state || null);
    
    // Clear district selection
    this.complexForm.get('courtDistrictId')?.setValue('');
    
    // Immediately filter districts
    this.filterDistrictsByState();
  }

  // ── CRUD handlers ─────────────────────────────────────────────────
  onSubmit(): void {
    if (this.complexForm.invalid) {
      this.complexForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields correctly.'
      });
      return;
    }

    const formValue = this.complexForm.value;
    const courtComplex: CreateCourtComplexDto = {
      name: formValue.name,
      code: formValue.code,
      courtId: formValue.courtId,
      stateId: formValue.stateId,
      courtDistrictId: formValue.courtDistrictId || null,
      address: formValue.address,
      isVirtualComplex: formValue.isVirtualComplex
    };

    if (this.isEditMode()) {
      const complexId = this.currentComplexId();
      if (complexId) {
        this.courtComplexFacade.updateCourtComplex(complexId, courtComplex);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Unable to determine court complex ID for update.'
        });
        return;
      }
    } else {
      this.courtComplexFacade.createCourtComplex(courtComplex);
    }

    // Wait for loading to complete before showing success
    this.loading$
      .pipe(
        filter(loading => !loading),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.error$
          .pipe(takeUntil(this.destroy$))
          .subscribe(error => {
            if (!error) {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: `Court Complex ${this.isEditMode() ? 'updated' : 'created'} successfully!`
              });
              this.toggleForm(true);
            }
          });
      });
  }

  onEdit(item: CourtComplex): void {
    this.isEditMode.set(true);
    this.showForm.set(true);
    this.currentComplexId.set(item.id);

    // Set form values
    this.complexForm.patchValue({
      courtId: item.courtId,
      stateId: item.stateId,
      courtDistrictId: item.courtDistrictId,
      name: item.name,
      code: item.code,
      address: item.address,
      isVirtualComplex: item.isVirtualComplex
    });

    // Update selections for dropdown filtering
    this.onCourtSelected(item.courtId);
    this.onStateSelected(item.stateId);
  }

  onDelete(item: CourtComplex): void {
    Swal.fire({
      title: 'Delete Confirmation',
      text: 'Are you sure you want to delete this court complex?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.courtComplexFacade.deleteCourtComplex(item.id);
        Swal.fire(
          'Deleted!',
          'Court Complex has been deleted.',
          'success'
        );
        setTimeout(() => {
          this.loadPage();
        }, 500);
      }
    });
  }

  onView(item: CourtComplex): void {
    Swal.fire({
      title: 'Court Complex Details',
      html: `<div style="text-align: left;">
               <p><strong>ID:</strong> ${item.id}</p>
               <p><strong>Court:</strong> ${item.courtName || 'N/A'}</p>
               <p><strong>State:</strong> ${item.stateName || 'N/A'}</p>
               <p><strong>District:</strong> ${item.courtDistrictName || 'N/A'}</p>
               <p><strong>Complex Name:</strong> ${item.name}</p>
               <p><strong>Code:</strong> ${item.code}</p>
               <p><strong>Address:</strong> ${item.address}</p>
               <p><strong>Virtual:</strong> ${item.isVirtualComplex ? 'Yes' : 'No'}</p>
             </div>`,
      icon: 'info',
      confirmButtonText: 'Close'
    });
  }

  // ── Error message helper ──────────────────────────────────────────
  getFieldErrorMessage(fieldName: string): string {
    const control = this.complexForm.get(fieldName);

    if (fieldName === 'name') {
      if (control?.hasError('required')) return 'Complex name is required';
      if (control?.hasError('minlength')) return 'Complex name must be at least 2 characters';
    }
    if (fieldName === 'code') {
      if (control?.hasError('required')) return 'Code is required';
    }
    if (fieldName === 'address') {
      if (control?.hasError('required')) return 'Address is required';
      if (control?.hasError('minlength')) return 'Address must be at least 5 characters';
    }
    if (fieldName === 'courtId') {
      if (control?.hasError('required')) return 'Court is required';
    }
    if (fieldName === 'stateId') {
      if (control?.hasError('required')) return 'State is required';
    }
    if (fieldName === 'courtDistrictId') {
      if (control?.hasError('required')) return 'Court District is required';
    }

    return '';
  }
}
