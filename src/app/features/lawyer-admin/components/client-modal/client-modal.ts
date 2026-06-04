import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { GenericFormModel } from '../../../../shared/components/generic-form-model/generic-form-model';
import { ClientFacade } from '../../facade/client.facade';
import { Client, ClientType } from '../../models/client.model';

@Component({
  selector: 'app-client-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericFormModel],
  templateUrl: './client-modal.html',
  styleUrls: ['./client-modal.css']
})
export class ClientModalComponent implements OnInit, OnChanges, OnDestroy {
  private fb = inject(FormBuilder);
  protected facade = inject(ClientFacade);
  private destroy$ = new Subject<void>();

  @Input() show = signal(false);
  @Input() isEditMode = signal(false);
  @Input() client: Client | null = null;
  @Output() clientAdded = new EventEmitter<Client>();
  @Output() closed = new EventEmitter<void>();

  clientTypes: ClientType[] = ['Individual', 'Corporate'];

  clientForm: FormGroup = this.fb.group({
    id: [''],
    clientType: ['Individual', Validators.required],
    name: ['', [Validators.required, Validators.minLength(2)]],
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
    officePhone: ['', [Validators.pattern(/^[0-9]{10}$/)]],
    email: ['', [Validators.required, Validators.email]],
    officeEmail: ['', [Validators.email]],
    referralBy: [''],
    registrationNo: [''],
    address: ['', [Validators.required, Validators.minLength(5)]]
  });

  private isSubmitting = signal(false);
  private lastSubmittedClientId: string | null = null;

  constructor() {
    this.clientForm.get('clientType')?.valueChanges.subscribe(type => {
      this.applyClientTypeValidation(type);
    });
  }

  ngOnInit(): void {
    this.facade.error$
      .pipe(
        takeUntil(this.destroy$),
        filter(error => error !== undefined && this.isSubmitting())
      )
      .subscribe(error => {
        this.isSubmitting.set(false);
        Swal.fire({
          title: 'Error',
          text: error,
          icon: 'error',
          confirmButtonText: 'OK',
          allowOutsideClick: false,
          allowEscapeKey: false
        }).then(() => {
          this.facade.clearError();
        });
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['client']) {
      if (this.client) {
        this.clientForm.patchValue({
          id: this.client.id,
          clientType: this.client.clientType ?? 'Individual',
          name: this.client.name,
          mobile: this.client.mobile,
          officePhone: this.client.officePhone ?? '',
          email: this.client.email ?? '',
          officeEmail: this.client.officeEmail ?? '',
          referralBy: this.client.referralBy ?? '',
          registrationNo: this.client.registrationNo ?? '',
          address: this.client.address ?? ''
        });
        this.applyClientTypeValidation(this.client.clientType ?? 'Individual');
      } else {
        this.resetForm();
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  resetForm(): void {
    this.clientForm.reset({
      id: '',
      clientType: 'Individual',
      name: '',
      mobile: '',
      officePhone: '',
      email: '',
      officeEmail: '',
      referralBy: '',
      registrationNo: '',
      address: ''
    });
    this.applyClientTypeValidation('Individual');
  }

  onSubmit(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    const client = this.clientForm.getRawValue() as Client;
    const clientId = client.id || `new-${Date.now()}`;
    const payload = {
      ...client,
      id: clientId,
      registrationNo: client.clientType === 'Corporate' ? client.registrationNo : ''
    };

    this.isSubmitting.set(true);
    this.lastSubmittedClientId = clientId;

    if (client.id) {
      this.facade.update(payload);
    } else {
      this.facade.add(payload);
    }

    this.clientAdded.emit(payload);

    // Schedule modal close and success message with a slight delay to allow state updates
    setTimeout(() => {
      if (this.isSubmitting()) {
        // Still submitting, let the error handler deal with it
        return;
      }
      // Success - close modal and show success message
      this.closeModal();
      Swal.fire('Success', `Client ${client.id ? 'updated' : 'added'} successfully.`, 'success');
    }, 1500);
  }

  closeModal(): void {
    this.resetForm();
    this.show.set(false);
    this.closed.emit();
    this.isSubmitting.set(false);
    this.lastSubmittedClientId = null;
    this.facade.clearError();
  }

  isCorporateClient(): boolean {
    return this.clientForm.get('clientType')?.value === 'Corporate';
  }

  isClientInvalid(controlPath: string): boolean {
    const control = this.clientForm.get(controlPath);
    return !!control && control.invalid && (control.dirty || control.touched);
  }

  isClientValid(controlPath: string): boolean {
    const control = this.clientForm.get(controlPath);
    return !!control && control.valid && (control.dirty || control.touched);
  }

  private applyClientTypeValidation(type: ClientType): void {
    const registrationNo = this.clientForm.get('registrationNo');
    if (!registrationNo) return;

    if (type === 'Corporate') {
      registrationNo.setValidators([Validators.required, Validators.minLength(2), this.noWhitespaceValidator]);
    } else {
      registrationNo.clearValidators();
      registrationNo.setValue('', { emitEvent: false });
    }

    registrationNo.updateValueAndValidity({ emitEvent: false });
  }

  private noWhitespaceValidator(control: AbstractControl): ValidationErrors | null {
    const value = `${control.value ?? ''}`.trim();
    return value ? null : { whitespace: true };
  }
}
