import { Component, OnInit, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  FormArray,
  Validators
} from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { NgSelectModule } from '@ng-select/ng-select';

import { CourtDistrict } from '../../models/court-district.model';
import { CourtDistrictFacade } from '../../facade/court-district.facade';
import { StateFacade } from '../../facade/state.facade';
import { GenericTable } from '../../../../shared';

interface State {
  id: number;
  name: string;
}

interface DistrictRow {
  id?: string;
  name: string;
}

@Component({
  selector: 'app-court-district',
  standalone: true,
  templateUrl: './court-district.html',
  styleUrls: ['./court-district.css'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgSelectModule,
    GenericTable
  ]
})
export class CourtDistrictComponent implements OnInit {

  // ── DI ────────────────────────────────────────────────────────────
  private fb        = inject(FormBuilder);
  private facade    = inject(CourtDistrictFacade);
  private stateFacade = inject(StateFacade);

  // ── Store streams ─────────────────────────────────────────────────
  courtDistricts$: Observable<CourtDistrict[]>   = this.facade.courtDistricts$;
  loading$:        Observable<boolean>           = this.facade.loading$;
  error$:          Observable<string | null>     = this.facade.error$;
  totalRecords$:   Observable<number>            = this.facade.totalRecords$;
  pageNumber$:     Observable<number>            = this.facade.pageNumber$;
  pageSize$:       Observable<number>            = this.facade.pageSize$;
  totalPages$:     Observable<number>            = this.facade.totalPages$;

  // ── State dropdown data ───────────────────────────────────────────
  states$: Observable<State[]>              = this.stateFacade.states$;
  statesLoading$: Observable<boolean>       = this.stateFacade.loading$;

  // ── Local UI state ────────────────────────────────────────────────
  showForm        = signal(false);
  currentPage     = signal(1);
  pageSize        = signal(10);
  isEditMode      = signal(false);
  selectedState   = signal<State | null>(null);
  allStates       = signal<State[]>([]);
  languages       = signal<any[]>([]);

  // ── Form ──────────────────────────────────────────────────────────
  courtDistrictForm: FormGroup = this.fb.group({
    stateId: ['', Validators.required],
    districts: this.fb.array([])
  });

  // ── Computed properties ───────────────────────────────────────────
  districts = computed(() => this.districtArray.controls);
  canAddMore = computed(() => {
    const districts = this.districtArray;
    if (districts.length === 0) return true;
    
    // Check if last row is valid
    const lastControl = districts.at(districts.length - 1);
    return lastControl?.valid ?? false;
  });

  // ── Table columns ─────────────────────────────────────────────────
  columns = [
    { key: 'id',        label: 'ID',           hidden: true, isKey: true },
    { key: 'stateName', label: 'State Name' },
    { key: 'name',      label: 'District Name' }
  ];

  constructor() {
    // Subscribe to states and update local signal
    this.states$.subscribe(statesList => {
      this.allStates.set(statesList as State[]);
    });
  }

  // ── Lifecycle ─────────────────────────────────────────────────────
  ngOnInit(): void {
    // Load all states without pagination (large pageSize)
    this.stateFacade.load(1, 1000, false);
    
    // Load available languages
    this.loadLanguages();
    
    // Load court districts for table view
    this.loadPage();
    this.addDistrictRow(); // Start with one empty row
  }

  // ── Getters ───────────────────────────────────────────────────────
  get districtArray(): FormArray {
    return this.courtDistrictForm.get('districts') as FormArray;
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

  goBackToList(): void {
    this.showForm.set(false);
    this.resetForm();
  }

  resetForm(): void {
    this.courtDistrictForm.reset({
      stateId: '',
      districts: []
    });
    this.selectedState.set(null);
    this.isEditMode.set(false);
    this.districtArray.clear();
    this.addDistrictRow();
  }

  // ── Dynamic District Rows ─────────────────────────────────────────
  addDistrictRow(): void {
    if (!this.canAddMore()) {
      Swal.fire({
        icon:  'warning',
        title: 'Validation Error',
        text:  'Please complete the current district before adding another.'
      });
      return;
    }

    const districtControl = this.fb.group({
      id:   [''],
      name: ['', [Validators.required, Validators.minLength(2)]]
    });

    this.districtArray.push(districtControl);
  }

  removeDistrictRow(index: number): void {
    if (this.districtArray.length === 1) {
      Swal.fire({
        icon:  'warning',
        title: 'Cannot Remove',
        text:  'At least one district row must remain.'
      });
      return;
    }

    Swal.fire({
      title:  'Confirm',
      text:   'Remove this district row?',
      icon:   'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor:  '#d33',
      confirmButtonText:  'Yes, remove it!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.districtArray.removeAt(index);
      }
    });
  }

  // ── CRUD handlers ─────────────────────────────────────────────────
  onSubmit(): void {
    if (this.courtDistrictForm.invalid) {
      this.courtDistrictForm.markAllAsTouched();
      Swal.fire({
        icon:  'warning',
        title: 'Validation Error',
        text:  'Please fill in all required fields correctly.'
      });
      return;
    }

    const formValue = this.courtDistrictForm.value;
    const stateId = formValue.stateId;
    const districtRows: DistrictRow[] = formValue.districts;

    // Build CourtDistrict objects for submission
    const courtDistricts: CourtDistrict[] = districtRows.map((district: DistrictRow) => ({
      id: district.id || '',
      name: district.name,
      stateId: parseInt(stateId, 10),
      translations: []
    }));

    // Submit all districts for the state as a single list with languages
    this.facade.submitDistrictsByState(
      parseInt(stateId, 10),
      courtDistricts,
      this.languages()
    );

    Swal.fire({
      icon:  'success',
      title: 'Success',
      text:  'Court Districts saved successfully!'
    });

    this.toggleForm(true);
  }

  onEdit(item: CourtDistrict): void {
    this.isEditMode.set(true);
    this.showForm.set(true);

    // Clear form first
    this.courtDistrictForm.reset();
    this.districtArray.clear();

    // Set state ID value directly
    const stateIdNum = item.stateId ? parseInt(item.stateId.toString(), 10) : null;
    if (stateIdNum) {
      // Use setValue to properly update the form control
      this.courtDistrictForm.get('stateId')?.setValue(stateIdNum);
      // Trigger state selection
      this.onStateSelected(stateIdNum);
    }

    // Add district
    const districtControl = this.fb.group({
      id:   [item.id],
      name: [item.name, [Validators.required, Validators.minLength(2)]]
    });
    this.districtArray.push(districtControl);
  }

  onDelete(item: CourtDistrict): void {
    Swal.fire({
      title:  'Delete Confirmation',
      text:   'Are you sure you want to delete this district?',
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
          'Court District has been deleted.',
          'success'
        );
        // Refresh the list after delete
        setTimeout(() => {
          this.loadPage();
        }, 500);
      }
    });
  }

  onView(item: CourtDistrict): void {
    Swal.fire({
      title:           'Court District Details',
      html:            `<div style="text-align: left;">
                          <p><strong>ID:</strong> ${item.id}</p>
                          <p><strong>State Name:</strong> ${item.stateName || 'N/A'}</p>
                          <p><strong>District Name:</strong> ${item.name}</p>
                        </div>`,
      icon:            'info',
      confirmButtonText: 'Close'
    });
  }

  // ── State selection handler ───────────────────────────────────────
  onStateSelected(stateId: number): void {
    if (stateId) {
      const state = this.allStates().find(s => s.id === stateId);
      if (state) {
        this.selectedState.set(state);
      }
    }
  }

  compareStates(s1: number, s2: number): boolean {
    return s1 === s2;
  }

  // ── Get district form error message ───────────────────────────────
  getDistrictErrorMessage(index: number): string {
    const control = this.districtArray.at(index)?.get('name');
    if (!control?.touched) return '';
    if (control?.hasError('required')) return 'District name is required';
    if (control?.hasError('minlength')) return 'Minimum 2 characters required';
    return '';
  }

  // ── Load languages ────────────────────────────────────────────────
  private loadLanguages(): void {
    // Default languages with language code
    const defaultLanguages = [
      { code: 'en', name: 'English' },
      { code: 'hi', name: 'Hindi' }
    ];
    this.languages.set(defaultLanguages);
  }
}
