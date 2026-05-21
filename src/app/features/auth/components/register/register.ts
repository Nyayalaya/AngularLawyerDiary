import { Component, Output, EventEmitter, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RegisterRequest } from '../../models/register-request.model';
import { AuthFacade } from '../../facade/auth.facade';
import { ValidationMessages } from '../../../../core';
import { Role, Gender } from '../../../../core';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  /** When embedded inside Welcome page, render without full-page background */
  @Input() embedded = false;

  @Output() loginClick = new EventEmitter<void>();

  returnUrl = '';
  registerForm!: FormGroup;
  Role = Role;
  roles = [
    { value: Role.LAWYER, label: 'Lawyer' },
    { value: Role.CORPORATE, label: 'Corporate' }
  ];

  genders = [
    { value: Gender.MALE, label: 'Male' },
    { value: Gender.FEMALE, label: 'Female' },
    { value: Gender.OTHER, label: 'Other' }
  ];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authFacade: AuthFacade,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.setupRoleChangeListener();
    // App uses `/default` as the login/start page
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/default';
  }
  private initializeForm(): void {
    this.registerForm = this.fb.group({
      role: ['', Validators.required],
      firstName: ['', Validators.required],
      middleName: [''],
      lastName: [''],
      dateOfBirth: [''],
      gender: [''],
      registrationNumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }
  private setupRoleChangeListener(): void {
    this.registerForm.get('role')?.valueChanges.subscribe(role => {
      this.updateValidatorsBasedOnRole(Number(role)); // ✅ FIX
    });
  }
  private updateValidatorsBasedOnRole(role: number): void {
    const firstName = this.registerForm.get('firstName');
    const middleName = this.registerForm.get('middleName');
    const lastName = this.registerForm.get('lastName');
    const dob = this.registerForm.get('dateOfBirth');
    const gender = this.registerForm.get('gender');

    if (role === Role.CORPORATE) {
      firstName?.setValidators([Validators.required]);

      middleName?.clearValidators();
      lastName?.clearValidators();
      dob?.clearValidators();
      gender?.clearValidators();

      middleName?.setValue('');
      lastName?.setValue('');
      dob?.setValue('');
      gender?.setValue('');
    } else {
      firstName?.setValidators([Validators.required]);
      lastName?.setValidators([Validators.required]);
      dob?.setValidators([Validators.required]);
      gender?.setValidators([Validators.required]);

      middleName?.clearValidators();
    }

    [firstName, middleName, lastName, dob, gender]
      .forEach(c => {
        c?.updateValueAndValidity({ emitEvent: false });
      });
  }
  onMobileInput(event: Event): void {
    const input = event.target as HTMLInputElement;

    // Remove non-digits
    input.value = input.value.replace(/\D/g, '');

    // Trim to 10 digits
    if (input.value.length > 10) {
      input.value = input.value.slice(0, 10);
    }

    // Update form control
    this.registerForm
      .get('mobileNumber')
      ?.setValue(input.value, { emitEvent: false });
  }
  private preparePayload(): RegisterRequest {
    const v = this.registerForm.value;
    const role = Number(v.role);

    const payload: RegisterRequest = {
      userType: role,
      individualInfoDto: null, // ✅ default
      companyInfoDto: null,    // ✅ default
      email: v.email,
      contact: v.mobileNumber,
      password: v.password
    };

    // ✅ Lawyer / Individual
    if (role === Role.LAWYER) {
      payload.individualInfoDto = {
        firstName: v.firstName,
        middleName: v.middleName?.trim() || '',
        lastName: v.lastName,
        enrollmentNumber: v.registrationNumber,
        dateOfBirth: v.dateOfBirth || null, // ✅ FIXED
        gender: v.gender !== '' ? Number(v.gender) : null // ✅ FIXED
      };
    }

    // ✅ Corporate
    if (role === Role.CORPORATE) {
      payload.companyInfoDto = {
        companyName: v.firstName,
        registrationNumber: v.registrationNumber,
        incorporationDate: v.incorporationDate?.trim() || null,
        gstNumber: v.middleName?.trim() || '',
        autherizedPerson: v.middleName?.trim() || ''
      };
    }

    return payload;
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      Object.keys(this.registerForm.controls)
        .forEach(key => {
          this.registerForm.get(key)?.markAsTouched();
        });
      return;
    }

    const payload = this.preparePayload();
    // dispatch action and let effects handle navigation and notifications
    this.authFacade.register(payload);
  }

  goToLogin(): void {
    // If hosted inside Welcome, toggle in-place. Otherwise navigate to route.
    if ((this.loginClick as any).observers?.length) {
      this.loginClick.emit();
      return;
    }
    this.router.navigate(['/default']);
  }
}
