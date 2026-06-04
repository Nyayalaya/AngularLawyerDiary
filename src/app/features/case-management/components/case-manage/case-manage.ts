import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import Swal from 'sweetalert2';

import { GenericTable } from '../../../../shared';
import { ClientModalComponent } from '../../../lawyer-admin/components/client-modal/client-modal';
import { Client, ClientType } from '../../../lawyer-admin/models/client.model';
import { CasesListDto } from '../../dtos/case-list.dto';
import { CaseManageFacade } from '../../facade/case-manage.facade';
import { CaseManage } from '../../models/case-manage.model';

type CaseTab = 'client' | 'details' | 'decision' | 'review';

interface LookupOption {
  id: string;
  name: string;
}

@Component({
  selector: 'app-case-manage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericTable, ClientModalComponent],
  templateUrl: './case-manage.html',
  styleUrls: ['./case-manage.css']
})
export class CaseManageComponent implements OnInit {
  private fb = inject(FormBuilder);
  private facade = inject(CaseManageFacade);

  activeTab = signal<CaseTab>('client');
  saving = signal(false);
  loading = signal(false);
  showCaseForm = signal(false);
  showClientModal = signal(false);
  clientModalEditMode = signal(false);
  isCaseEditMode = signal(false);
  newClientIds = signal<Set<string>>(new Set());
  totalRecords = signal(0);
  pageNumber = signal(1);
  pageSize = signal(10);
  totalPages = signal(0);

  tabs: { id: CaseTab; label: string }[] = [
    { id: 'client', label: 'Case Client Info' },
    { id: 'details', label: 'Case Detail Information' },
    { id: 'decision', label: 'Against Case Decision For' },
    { id: 'review', label: 'Final Review' }
  ];

  caseColumns = [
    { key: 'caseType', label: 'Case Type' },
    { key: 'caseNumber', label: 'Case Number' },
    { key: 'caseTitle', label: 'Case Title' },
    { key: 'filingDate', label: 'Filing Date' },
    { key: 'nextDate', label: 'Next Date' },
    { key: 'status', label: 'Status' }
  ];

  caseList = signal<CasesListDto[]>([]);

  clients: LookupOption[] = [
    { id: '1', name: 'URBAN IMPROVEMENT TRUST BHARATPUR (8385834350 - BHARATPUR)' },
    { id: '2', name: 'KARAN SINGH' },
    { id: '3', name: 'UMMEDI LAL AND ORS' }
  ];

  clientTypes: ClientType[] = ['Individual', 'Corporate'];

  appearances: LookupOption[] = [
    { id: 'plaintiff-respondent', name: 'Plaintiff Respondent' },
    { id: 'plaintiff-appellant', name: 'Plaintiff Appellant' },
    { id: 'defendant-respondent', name: 'Defendant Respondent' }
  ];

  states: LookupOption[] = [
    { id: 'rajasthan', name: 'RAJASTHAN' },
    { id: 'delhi', name: 'DELHI' },
    { id: 'maharashtra', name: 'MAHARASHTRA' }
  ];

  courtTypes: LookupOption[] = [
    { id: 'high-court', name: 'HIGH COURT' },
    { id: 'district-court', name: 'DISTRICT COURT' },
    { id: 'tribunal', name: 'TRIBUNAL' }
  ];

  benches: LookupOption[] = [
    { id: 'jaipur-bench', name: 'JAIPUR BENCH' },
    { id: 'jodhpur-bench', name: 'JODHPUR BENCH' }
  ];

  caseCategories: LookupOption[] = [
    { id: 'civil', name: 'CIVIL' },
    { id: 'criminal', name: 'CRIMINAL' },
    { id: 'writ', name: 'WRIT' }
  ];

  caseTypes: LookupOption[] = [
    { id: 'civil-first-appeal', name: 'CIVIL FIRST APPEAL' },
    { id: 'civil-writ', name: 'CIVIL WRIT PETITION' },
    { id: 'criminal-appeal', name: 'CRIMINAL APPEAL' }
  ];

  partyTypes: LookupOption[] = [
    { id: 'plaintiff-appellant', name: 'Plaintiff Appellant' },
    { id: 'plaintiff-respondent', name: 'Plaintiff Respondent' },
    { id: 'defendant-appellant', name: 'Defendant Appellant' },
    { id: 'defendant-respondent', name: 'Defendant Respondent' }
  ];

  caseStages: LookupOption[] = [
    { id: 'admission-notice-served', name: 'ADMISSION WITH NOTICE SERVED' },
    { id: 'hearing', name: 'HEARING' },
    { id: 'final-argument', name: 'FINAL ARGUMENT' }
  ];

  years = Array.from({ length: 32 }, (_, index) => `${new Date().getFullYear() - index}`);

  courtDistricts: LookupOption[] = [
    { id: 'jaipur', name: 'JAIPUR' },
    { id: 'bharatpur', name: 'BHARATPUR' }
  ];

  courtComplexes: LookupOption[] = [
    { id: 'jaipur-complex', name: 'JAIPUR COURT COMPLEX' },
    { id: 'bharatpur-complex', name: 'BHARATPUR COURT COMPLEX' }
  ];

  courts: LookupOption[] = [
    { id: 'court-1', name: 'Court No. 1' },
    { id: 'court-2', name: 'Court No. 2' }
  ];

  cadres: LookupOption[] = [
    { id: 'sb', name: 'S.B.' },
    { id: 'db', name: 'D.B.' }
  ];

  linkedCases: LookupOption[] = [
    { id: 'none', name: 'No linked case' },
    { id: 'linked-1477-2025', name: '1477/2025' }
  ];

  caseForm: FormGroup = this.fb.group({
    id: [''],
    clientId: ['', Validators.required],
    appearance: ['', Validators.required],
    institutionDate: ['', Validators.required],
    stateId: ['', Validators.required],
    courtTypeId: ['', Validators.required],
    benchId: ['', Validators.required],
    strength: [''],
    caseCategoryId: ['', Validators.required],
    caseTypeId: ['', Validators.required],
    titleFirst: ['', [Validators.required, Validators.minLength(2)]],
    titleFirstPartyType: ['', Validators.required],
    titleSecond: ['', [Validators.required, Validators.minLength(2)]],
    titleSecondPartyType: ['', Validators.required],
    caseStageId: ['', Validators.required],
    caseNo: [''],
    caseYear: [''],
    cisNumber: [''],
    cisYear: [''],
    cnrNo: [''],
    nextDate: [''],
    linkedWith: [''],
    decision: this.fb.group({
      impugnedOrderDate: [''],
      stateId: [''],
      courtTypeId: [''],
      courtDistrictId: [''],
      courtComplexId: [''],
      courtId: [''],
      caseCategoryId: [''],
      caseTypeId: [''],
      caseNo: [''],
      caseYear: [''],
      cisNumber: [''],
      cisYear: [''],
      cnrNo: [''],
      officerName: [''],
      cadreId: ['']
    })
  });

  ngOnInit(): void {
    this.loadCases();
  }

  loadCases(pageNumber = this.pageNumber(), pageSize = this.pageSize()): void {
    this.loading.set(true);
    this.facade.loadCases(pageNumber, pageSize).subscribe({
      next: response => {
        this.caseList.set(response.data ?? []);
        this.totalRecords.set(response.pagination?.totalCount ?? response.data?.length ?? 0);
        this.pageNumber.set(response.pagination?.pageNumber ?? pageNumber);
        this.pageSize.set(response.pagination?.pageSize ?? pageSize);
        this.totalPages.set(response.pagination?.totalPages ?? 1);
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        this.caseList.set([]);
        Swal.fire('Error', error.message ?? 'Unable to load case details.', 'error');
      }
    });
  }

  onPageChanged(event: { page: number; pageSize: number }): void {
    this.loadCases(event.page, event.pageSize);
  }

  setTab(tab: CaseTab): void {
    this.activeTab.set(tab);
  }

  openAddCase(): void {
    this.isCaseEditMode.set(false);
    this.resetForm();
    this.showCaseForm.set(true);
  }

  openAddClient(): void {
    this.clientModalEditMode.set(false);
    this.showClientModal.set(true);
  }

  onClientAdded(client: Client): void {
    const clientId = client.id;
    const clientName = `${client.name} (${client.mobile})`;

    this.clients = [...this.clients, { id: clientId, name: clientName }];
    this.newClientIds.set(new Set([...this.newClientIds(), clientId]));
    this.caseForm.patchValue({ clientId });
  }

  onViewCase(item: CasesListDto): void {
    Swal.fire({
      title: 'Case Detail',
      html: `<div style="text-align:left">
               <p><strong>Case Number:</strong> ${item.caseNumber}</p>
               <p><strong>Case Title:</strong> ${item.caseTitle}</p>
               <p><strong>Case Type:</strong> ${item.caseType}</p>
               <p><strong>Filing Date:</strong> ${item.filingDate}</p>
               <p><strong>Next Date:</strong> ${item.nextDate}</p>
               <p><strong>Assigned Lawyer:</strong> ${item.assignedLawyer || '-'}</p>
               <p><strong>Status:</strong> ${item.status || '-'}</p>
             </div>`,
      icon: 'info'
    });
  }

  onEditCase(item: CasesListDto): void {
    this.isCaseEditMode.set(true);
    this.loading.set(true);
    this.facade.getCaseById(item.id).subscribe({
      next: caseDetail => {
        this.loading.set(false);
        this.patchCaseForm(caseDetail);
        this.showCaseForm.set(true);
        this.activeTab.set('client');
      },
      error: () => {
        this.loading.set(false);
        this.patchCaseFormFromList(item);
        this.showCaseForm.set(true);
        this.activeTab.set('client');
        Swal.fire('Notice', 'Full case detail could not be loaded. Basic list details are available for editing.', 'info');
      }
    });
  }

  onDeleteCase(item: CasesListDto): void {
    Swal.fire({
      title: 'Delete Confirmation',
      text: `Are you sure you want to delete ${item.caseNumber}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it'
    }).then(result => {
      if (result.isConfirmed) {
        this.loading.set(true);
        this.facade.deleteCase(item.id).subscribe({
          next: () => {
            this.loading.set(false);
            Swal.fire('Deleted', 'Case detail deleted successfully.', 'success');
            this.loadCases(this.pageNumber(), this.pageSize());
          },
          error: error => {
            this.loading.set(false);
            Swal.fire('Error', error.message ?? 'Unable to delete case detail.', 'error');
          }
        });
      }
    });
  }

  nextTab(): void {
    if (!this.validateTab(this.activeTab())) return;

    const currentIndex = this.tabs.findIndex(tab => tab.id === this.activeTab());
    if (currentIndex < this.tabs.length - 1) {
      this.activeTab.set(this.tabs[currentIndex + 1].id);
    }
  }

  previousTab(): void {
    const currentIndex = this.tabs.findIndex(tab => tab.id === this.activeTab());
    if (currentIndex > 0) {
      this.activeTab.set(this.tabs[currentIndex - 1].id);
    }
  }

  saveDraft(): void {
    Swal.fire('Draft Saved', 'Case details are saved as a draft in this session.', 'success');
  }

  saveAndNext(): void {
    if (!this.validateTab(this.activeTab())) return;

    if (this.activeTab() === 'review') {
      this.saveCase();
      return;
    }

    const currentIndex = this.tabs.findIndex(tab => tab.id === this.activeTab());
    if (currentIndex < this.tabs.length - 1) {
      this.activeTab.set(this.tabs[currentIndex + 1].id);
    }
  }

  saveCase(): void {
    if (this.activeTab() !== 'review') {
      this.nextTab();
      return;
    }

    if (this.caseForm.invalid) {
      this.caseForm.markAllAsTouched();
      this.activeTab.set('client');
      Swal.fire('Validation Error', 'Please complete all required case fields before final save.', 'warning');
      return;
    }

    this.saving.set(true);
    this.facade.saveCase(this.caseForm.getRawValue() as CaseManage).subscribe({
      next: () => {
        this.saving.set(false);
        this.loadCases(this.pageNumber(), this.pageSize());
        this.showCaseForm.set(false);
        Swal.fire('Success', 'Final review complete. Case detail saved successfully.', 'success');
      },
      error: error => {
        this.saving.set(false);
        Swal.fire('Error', error.message ?? 'Unable to save case detail.', 'error');
      }
    });
  }

  resetForm(): void {
    this.caseForm.reset();
    this.activeTab.set('client');
  }

  isInvalid(controlPath: string): boolean {
    const control = this.caseForm.get(controlPath);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  isExistingClient(clientId: string): boolean {
    return !this.newClientIds().has(clientId);
  }

  displayValue(options: LookupOption[], id: string | null | undefined): string {
    return options.find(option => option.id === id)?.name ?? '-';
  }

  get review() {
    return this.caseForm.getRawValue() as CaseManage;
  }

  get isFirstTab(): boolean {
    return this.activeTab() === this.tabs[0].id;
  }

  get isReviewTab(): boolean {
    return this.activeTab() === 'review';
  }

  copyCase(): void {
    Swal.fire('Copied', 'Case details are ready to copy.', 'success');
  }

  bringCase(): void {
    Swal.fire('Bring Case', 'Bring case action initiated.', 'info');
  }

  repeatCase(): void {
    const current = this.caseForm.getRawValue();
    this.caseForm.patchValue({ ...current, id: '', caseNo: '', cnrNo: '' });
    this.showCaseForm.set(true);
    this.activeTab.set('client');
  }

  private validateTab(tab: CaseTab): boolean {
    const controlsByTab: Record<CaseTab, string[]> = {
      client: ['clientId', 'appearance'],
      details: [
        'institutionDate',
        'stateId',
        'courtTypeId',
        'benchId',
        'caseCategoryId',
        'caseTypeId',
        'titleFirst',
        'titleFirstPartyType',
        'titleSecond',
        'titleSecondPartyType',
        'caseStageId'
      ],
      decision: [],
      review: []
    };

    const invalidControls = controlsByTab[tab].filter(path => this.caseForm.get(path)?.invalid);
    invalidControls.forEach(path => this.caseForm.get(path)?.markAsTouched());

    if (invalidControls.length) {
      Swal.fire('Validation Error', 'Please complete required fields before moving next.', 'warning');
      return false;
    }

    return true;
  }

  private patchCaseForm(caseDetail: CaseManage): void {
    this.caseForm.reset();
    this.caseForm.patchValue({
      ...caseDetail,
      institutionDate: this.toDateInput(caseDetail.institutionDate),
      nextDate: this.toDateInput(caseDetail.nextDate),
      decision: {
        ...caseDetail.decision,
        impugnedOrderDate: this.toDateInput(caseDetail.decision?.impugnedOrderDate)
      }
    });
  }

  private patchCaseFormFromList(item: CasesListDto): void {
    const [caseNo = '', caseYear = ''] = (item.caseNumber || '').split('/');
    const [titleFirst = '', titleSecond = ''] = (item.caseTitle || '').split(/\s+VS\s+/i);

    this.caseForm.reset();
    this.caseForm.patchValue({
      id: item.id,
      caseNo,
      caseYear,
      titleFirst,
      titleSecond,
      nextDate: this.toDateInput(item.nextDate),
      institutionDate: this.toDateInput(item.filingDate)
    });
  }

  private toDisplayDate(value?: string): string {
    if (!value) return '-';
    const [year, month, day] = value.split('-');
    return day && month && year ? `${day}-${month}-${year}` : value;
  }

  private toDateInput(value?: string): string {
    if (!value) return '';
    const [day, month, year] = value.split('-');
    return day && month && year ? `${year}-${month}-${day}` : value;
  }
}
