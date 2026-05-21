import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, inject, signal } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators
} from '@angular/forms';
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
export class ClientModalComponent implements OnChanges {
  private fb = inject(FormBuilder);
  protected facade = inject(ClientFacade);

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
    mobile: ['', [Validators.required, Validators.pattern(/^[0-9+\-\s()]{7,20}$/)]],
    officePhone: ['', [Validators.pattern(/^[0-9+\-\s()]{7,20}$/)]],
    email: ['', [Validators.required, Validators.email]],
    officeEmail: ['', [Validators.email]],
    referralBy: [''],
    registrationNo: [''],
    propertyName: ['', [Validators.required, Validators.minLength(2)]],
    address: ['', [Validators.required, Validators.minLength(5)]]
  });

  constructor() {
    this.clientForm.get('clientType')?.valueChanges.subscribe(type => {
      this.applyClientTypeValidation(type);
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
          propertyName: this.client.propertyName,
          address: this.client.address ?? ''
        });
        this.applyClientTypeValidation(this.client.clientType ?? 'Individual');
      } else {
        this.resetForm();
      }
    }
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
      propertyName: '',
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

    if (client.id) {
      this.facade.update(payload);
    } else {
      this.facade.add(payload);
    }

    this.clientAdded.emit(payload);

    this.closeModal();
    Swal.fire('Success', `Client ${client.id ? 'updated' : 'added'} successfully.`, 'success');
  }

  closeModal(): void {
    this.resetForm();
    this.show.set(false);
    this.closed.emit();
  }

  isCorporateClient(): boolean {
    return this.clientForm.get('clientType')?.value === 'Corporate';
  }

  isClientInvalid(controlPath: string): boolean {
    const control = this.clientForm.get(controlPath);
    return !!control && control.invalid && (control.dirty || control.touched);
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
