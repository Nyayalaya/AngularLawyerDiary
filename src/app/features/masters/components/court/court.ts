import { Component, OnInit, OnDestroy, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators
} from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { map, takeUntil, filter } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';

import { Court } from '../../models/court.model';
import { CourtTypeModel } from '../../models/court-type.model';
import { StateModel } from '../../models/state.model';
import { CourtDistrict } from '../../models/court-district.model';

import { CourtFacade } from '../../facade/court.facade';
import { CourtTypeFacade } from '../../facade/court-type.facade';
import { StateFacade } from '../../facade/state.facade';
import { CourtDistrictFacade } from '../../facade/court-district.facade';
import { GenericTable } from '../../../../shared';

import { CreateCourtDto } from '../../dtos/court.dto';

interface CourtRow {
  id?: string;
  name: string;
  code: string;
  isVirtualCourt: boolean;
}

@Component({
  selector: 'app-court',
  standalone: true,
  templateUrl: './court.html',
  styleUrls: ['./court.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    GenericTable
  ]
})
export class CourtComponent implements OnInit, OnDestroy {

  // ── DI ────────────────────────────────────────────────────────────
  private fb = inject(FormBuilder);
  private courtFacade = inject(CourtFacade);
  private courtTypeFacade = inject(CourtTypeFacade);
  private stateFacade = inject(StateFacade);
  private courtDistrictFacade = inject(CourtDistrictFacade);
  private destroy$ = new Subject<void>();

  // ── Store streams ─────────────────────────────────────────────────
  courts$: Observable<Court[]> = this.courtFacade.courts$;
  loading$: Observable<boolean> = this.courtFacade.loading$;
  error$: Observable<string | null> = this.courtFacade.error$;
  totalRecords$: Observable<number> = this.courtFacade.totalRecords$;
  pagination$: Observable<any> = this.courtFacade.pagination$;
  pageNumber$ = this.pagination$.pipe(map(p => p?.pageNumber ?? 1));
  pageSize$ = this.pagination$.pipe(map(p => p?.pageSize ?? 10));
  totalPages$ = this.pagination$.pipe(map(p => p?.totalPages ?? 0));

  // ── Dropdown data ─────────────────────────────────────────────────
  courtTypes$: Observable<CourtTypeModel[]> = this.courtTypeFacade.courtTypes$;
  states$: Observable<StateModel[]> = this.stateFacade.states$;
  courtDistricts$: Observable<CourtDistrict[]> = this.courtDistrictFacade.courtDistricts$;

  // ── Local UI state ────────────────────────────────────────────────
  showForm = signal(false);
  currentPage = signal(1);
  pageSize = signal(10);
  isEditMode = signal(false);
  selectedCourtType = signal<CourtTypeModel | null>(null);
  selectedState = signal<StateModel | null>(null);
  filteredDistricts = signal<CourtDistrict[]>([]);
  allCourtTypes = signal<CourtTypeModel[]>([]);
  allStates = signal<StateModel[]>([]);
  allDistricts = signal<CourtDistrict[]>([]);

  // ── Form ──────────────────────────────────────────────────────────
  courtForm: FormGroup = this.fb.group({
    courtTypeId: ['', Validators.required],
    stateId: ['', Validators.required],
    courtDistrictId: ['', Validators.required],
    courts: this.fb.array([])
  });

  // ── Computed properties ───────────────────────────────────────────
  courts = computed(() => this.courtArray.controls);
  canAddMore = computed(() => {
    const courts = this.courtArray;
    if (courts.length === 0) return true;

    // Check if all rows are valid
    return courts.controls.every((control, index) => {
      return control?.valid ?? false;
    });
  });

  // ── State type helpers ────────────────────────────────────────────
  isSupremeCourt = computed(() => {
    const courtType = this.selectedCourtType();
    return courtType?.name.toLowerCase().includes('supreme') ?? false;
  });

  isHighCourt = computed(() => {
    const courtType = this.selectedCourtType();
    return courtType?.name.toLowerCase().includes('high') ?? false;
  });

  // ── Table columns ─────────────────────────────────────────────────
  columns = [
    { key: 'id', label: 'ID', hidden: true, isKey: true },
    { key: 'courtTypeName', label: 'Court Type' },
    { key: 'stateName', label: 'State' },
    { key: 'courtDistrictName', label: 'Court District' },
    { key: 'name', label: 'Court' },
    { key: 'code', label: 'Code' },
    { key: 'isVirtualCourt', label: 'Is Virtual' }
  ];

  constructor() {
    // Subscribe to data and update local signals with proper cleanup
    this.courtTypes$
      .pipe(takeUntil(this.destroy$))
      .subscribe(types => {
        this.allCourtTypes.set(types);
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
      // Enable district control when state is selected and districts exist
      if (filtered.length > 0) {
        this.courtForm.get('courtDistrictId')?.enable();
      }
    } else {
      this.filteredDistricts.set([]);
      this.courtForm.get('courtDistrictId')?.disable();
      this.courtForm.get('courtDistrictId')?.setValue('');
    }
  }

  // ── Lifecycle - Cleanup ───────────────────────────────────────────
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Lifecycle ─────────────────────────────────────────────────────
  ngOnInit(): void {
    this.courtTypeFacade.load(1, 1000, false);
    this.stateFacade.load(1, 1000, false);
    this.courtDistrictFacade.load(1, 1000, false);
    
    this.loadPage();
    this.addCourtRow();
  }

  // ── Getters ───────────────────────────────────────────────────────
  get courtArray(): FormArray {
    return this.courtForm.get('courts') as FormArray;
  }

  // ── Pagination ────────────────────────────────────────────────────
  loadPage(): void {
    this.courtFacade.loadCourts(this.currentPage(), this.pageSize());
  }

  onPageChanged(event: { page: number; pageSize: number }): void {
    this.currentPage.set(event.page);
    this.pageSize.set(event.pageSize);
    this.courtFacade.loadCourts(event.page, event.pageSize);
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
    this.courtForm.reset({
      courtTypeId: '',
      stateId: '',
      courtDistrictId: '',
      courts: []
    });
    this.selectedCourtType.set(null);
    this.selectedState.set(null);
    this.filteredDistricts.set([]);
    this.isEditMode.set(false);
    this.courtArray.clear();
    this.addCourtRow();
    this.updateStateAndDistrictControls();
  }

  // ── Court Type Selection ──────────────────────────────────────────
  onCourtTypeSelected(courtTypeId: string): void {
    const courtType = this.allCourtTypes().find(ct => ct.id === courtTypeId);
    this.selectedCourtType.set(courtType || null);
    this.updateStateAndDistrictControls();
  }

  // ── State Selection ───────────────────────────────────────────────
  onStateSelected(stateId: string | number | null): void {
    // Handle null or empty values
    if (!stateId && stateId !== 0) {
      this.selectedState.set(null);
      this.filteredDistricts.set([]);
      this.courtForm.get('courtDistrictId')?.setValue('');
      return;
    }

    const numStateId = typeof stateId === 'string' ? parseInt(stateId, 10) : stateId;
    if (isNaN(numStateId)) {
      this.selectedState.set(null);
      this.filteredDistricts.set([]);
      this.courtForm.get('courtDistrictId')?.setValue('');
      return;
    }

    const state = this.allStates().find(s => s.id === numStateId);
    this.selectedState.set(state || null);
    
    // Clear district selection
    this.courtForm.get('courtDistrictId')?.setValue('');
    
    // Immediately filter districts
    this.filterDistrictsByState();
  }

  // ── Update validators based on court type ──────────────────────────
  private updateStateAndDistrictControls(): void {
    const stateControl = this.courtForm.get('stateId');
    const districtControl = this.courtForm.get('courtDistrictId');

    if (this.isSupremeCourt()) {
      stateControl?.clearValidators();
      stateControl?.setValue('');
      stateControl?.disable();
      districtControl?.clearValidators();
      districtControl?.setValue('');
      districtControl?.disable();
    } else if (this.isHighCourt()) {
      stateControl?.setValidators([Validators.required]);
      stateControl?.enable();
      districtControl?.clearValidators();
      districtControl?.setValue('');
      districtControl?.disable();
    } else {
      stateControl?.setValidators([Validators.required]);
      stateControl?.enable();
      districtControl?.setValidators([Validators.required]);
      // Only enable if a state is selected
      if (this.selectedState()?.id) {
        districtControl?.enable();
      } else {
        districtControl?.disable();
      }
    }

    stateControl?.updateValueAndValidity({ emitEvent: false });
    districtControl?.updateValueAndValidity({ emitEvent: false });
  }

  // ── Dynamic Court Rows ────────────────────────────────────────────
  addCourtRow(): void {
    if (!this.canAddMore()) {
      // Find which row has validation errors
      const courts = this.courtArray;
      let errorMessage = 'Please complete all court details before adding another row:\n';
      let hasErrors = false;

      courts.controls.forEach((control, index) => {
        if (control?.invalid) {
          hasErrors = true;
          if (control.get('name')?.invalid) {
            errorMessage += `• Row ${index + 1}: Court name is required (min 2 characters)\n`;
          }
          if (control.get('code')?.invalid) {
            errorMessage += `• Row ${index + 1}: Code is required\n`;
          }
        }
      });

      if (hasErrors) {
        Swal.fire({
          icon: 'warning',
          title: 'Validation Error',
          html: errorMessage.replace(/\n/g, '<br>')
        });
        return;
      }
    }

    const courtControl = this.fb.group({
      id: [''],
      name: ['', [Validators.required, Validators.minLength(2)]],
      code: ['', [Validators.required, Validators.minLength(1)]],
      isVirtualCourt: [false]
    });

    this.courtArray.push(courtControl);
  }

  removeCourtRow(index: number): void {
    if (this.courtArray.length === 1) {
      Swal.fire({
        icon: 'warning',
        title: 'Cannot Remove',
        text: 'At least one court row must remain.'
      });
      return;
    }

    Swal.fire({
      title: 'Confirm',
      text: 'Remove this court row?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.courtArray.removeAt(index);
      }
    });
  }

  // ── CRUD handlers ─────────────────────────────────────────────────
  onSubmit(): void {
    if (this.courtForm.invalid) {
      this.courtForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields correctly.'
      });
      return;
    }

    const formValue = this.courtForm.getRawValue();
    const courtTypeId = formValue.courtTypeId;
    const stateId = formValue.stateId || null;
    const courtDistrictId = formValue.courtDistrictId || null;
    const courtRows: CourtRow[] = formValue.courts;

    // Build Court objects for submission
    const courts: CreateCourtDto[] = courtRows.map((court: CourtRow) => {
      const courtDto: CreateCourtDto = {
        name: court.name,
        code: court.code,
        courtTypeId: courtTypeId,
        isVirtualCourt: court.isVirtualCourt
      };

      // Only include stateId if not Supreme Court
      if (!this.isSupremeCourt()) {
        courtDto.stateId = stateId;
      }

      // Only include courtDistrictId if not Supreme Court and not High Court
      if (!this.isSupremeCourt() && !this.isHighCourt()) {
        courtDto.courtDistrictId = courtDistrictId;
      }

      return courtDto;
    });

    // Track submission completion
    const submissionStarted = Date.now();
    let submissionCount = 0;
    const totalSubmissions = courts.length;

    // Submit each court
    courts.forEach((court, index) => {
      if (this.isEditMode()) {
        // For edit mode, update single court
        const court_id = courtRows[0].id;
        if (court_id) {
          this.courtFacade.updateCourt(court_id, court);
          submissionCount++;
        }
      } else {
        // For add mode, create multiple courts
        this.courtFacade.createCourt(court);
        submissionCount++;
      }
    });

    // Wait for loading to complete before showing success
    this.loading$
      .pipe(
        filter(loading => !loading),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        // Check if there are no errors
        this.error$
          .pipe(takeUntil(this.destroy$))
          .subscribe(error => {
            if (!error) {
              Swal.fire({
                icon: 'success',
                title: 'Success',
                text: `Court${totalSubmissions > 1 ? 's' : ''} saved successfully!`
              });
              this.toggleForm(true);
            }
          });
      });
  }

  onEdit(item: Court): void {
    this.isEditMode.set(true);
    this.showForm.set(true);

    // Clear form first
    this.courtForm.reset();
    this.courtArray.clear();

    // Set court type and update controls
    this.courtForm.get('courtTypeId')?.setValue(item.courtTypeId);
    this.onCourtTypeSelected(item.courtTypeId);

    // Set state if available
    if (item.stateId) {
      this.courtForm.get('stateId')?.setValue(item.stateId);
      this.onStateSelected(item.stateId);
    }

    // Set district if available
    if (item.courtDistrictId) {
      this.courtForm.get('courtDistrictId')?.setValue(item.courtDistrictId);
    }

    // Add court row
    const courtControl = this.fb.group({
      id: [item.id],
      name: [item.name, [Validators.required, Validators.minLength(2)]],
      code: [item.code, [Validators.required, Validators.minLength(1)]],
      isVirtualCourt: [item.isVirtualCourt]
    });
    this.courtArray.push(courtControl);
  }

  onDelete(item: Court): void {
    Swal.fire({
      title: 'Delete Confirmation',
      text: 'Are you sure you want to delete this court?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.courtFacade.deleteCourt(item.id);
        Swal.fire(
          'Deleted!',
          'Court has been deleted.',
          'success'
        );
        setTimeout(() => {
          this.loadPage();
        }, 500);
      }
    });
  }

  onView(item: Court): void {
    Swal.fire({
      title: 'Court Details',
      html: `<div style="text-align: left;">
               <p><strong>ID:</strong> ${item.id}</p>
               <p><strong>Court Type:</strong> ${item.courtTypeName || 'N/A'}</p>
               <p><strong>State:</strong> ${item.stateName || 'N/A'}</p>
               <p><strong>District:</strong> ${item.courtDistrictName || 'N/A'}</p>
               <p><strong>Court Name:</strong> ${item.name}</p>
               <p><strong>Code:</strong> ${item.code}</p>
               <p><strong>Virtual:</strong> ${item.isVirtualCourt ? 'Yes' : 'No'}</p>
             </div>`,
      icon: 'info',
      confirmButtonText: 'Close'
    });
  }

  // ── Error message helper ──────────────────────────────────────────
  getCourtErrorMessage(index: number): string {
    const control = this.courtArray.at(index);
    const nameControl = control?.get('name');
    const codeControl = control?.get('code');

    if (nameControl?.hasError('required')) {
      return 'Court name is required';
    }
    if (nameControl?.hasError('minlength')) {
      return 'Court name must be at least 2 characters';
    }
    if (codeControl?.hasError('required')) {
      return 'Code is required';
    }

    return '';
  }
}

