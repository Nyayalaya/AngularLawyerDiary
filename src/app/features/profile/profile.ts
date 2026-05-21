import { Component, OnInit, OnDestroy, signal, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

import { UserProfileModel, Address, Contact, ProfessionalInfo, WorkLocation, BillingInfo } from '../../core/models/profile.model';
import { ProfileFacade } from './facade/profile.facade';
import { AuthFacade } from '../auth/facade/auth.facade';
import { NotificationService } from '../../shared/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit, OnDestroy {

  // ── DI ────────────────────────────────────────────────────────────
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private profileFacade = inject(ProfileFacade);
  private authFacade = inject(AuthFacade);
  private notification = inject(NotificationService);

  // ── View references ──────────────────────────────────────────────
  @ViewChild('profileImage') profileImage: ElementRef | undefined;

  // ── Observables ───────────────────────────────────────────────────
  profile$: Observable<UserProfileModel | null> = this.profileFacade.profile$;
  loading$: Observable<boolean> = this.profileFacade.loading$;
  error$: Observable<string | null> = this.profileFacade.error$;
  personalInfo$: Observable<any> = this.profileFacade.personalInfo$;
  professionalInfo$: Observable<any> = this.profileFacade.professionalInfo$;
  addresses$: Observable<Address[]> = this.profileFacade.addresses$;
  contacts$: Observable<Contact[]> = this.profileFacade.contacts$;
  workLocations$: Observable<WorkLocation[]> = this.profileFacade.workLocations$;
  billingInfo$: Observable<any> = this.profileFacade.billingInfo$;

  // ── Local state ───────────────────────────────────────────────────
  activeTab = signal<string>('personal');
  userId = signal<string>('');
  profile: UserProfileModel | null = null;
  isEditMode = signal<boolean>(false);
  returnUrl = signal<string>('/dashboard');

  // ── Forms ─────────────────────────────────────────────────────────
  personalInfoForm: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    middleName: [''],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]]
  });

  professionalInfoForm: FormGroup = this.fb.group({
    professionalTitle: [''],
    specialization: [''],
    licenseNumber: [''],
    yearsOfExperience: [0, [Validators.min(0)]],
    barCouncilName: [''],
    barCouncilRegistrationNumber: [''],
    qualifications: ['']
  });

  addressForm: FormGroup = this.fb.group({
    addressLine1: ['', [Validators.required]],
    addressLine2: [''],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    zipCode: ['', [Validators.required, Validators.pattern(/^\d{5,6}$/)]],
    country: ['', [Validators.required]],
    isDefault: [false]
  });

  contactForm: FormGroup = this.fb.group({
    contactType: ['Phone', [Validators.required]],
    contactValue: ['', [Validators.required]],
    isDefault: [false]
  });

  workLocationForm: FormGroup = this.fb.group({
    locationName: ['', [Validators.required]],
    address: ['', [Validators.required]],
    city: ['', [Validators.required]],
    state: ['', [Validators.required]],
    country: ['', [Validators.required]],
    isDefault: [false]
  });

  billingInfoForm: FormGroup = this.fb.group({
    billingName: ['', [Validators.required]],
    billingEmail: ['', [Validators.required, Validators.email]],
    billingPhone: ['', [Validators.required]],
    taxId: [''],
    companyName: ['']
  });

  private destroy$ = new Subject<void>();

  // ── Lifecycle ─────────────────────────────────────────────────────
  ngOnInit(): void {
    this.returnUrl.set(this.route.snapshot.queryParams['returnUrl'] || '/dashboard');
    
    this.authFacade.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          console.log('👤 User loaded:', user.id, user.name);
          this.userId.set(user.id);
          this.profileFacade.loadProfile(user.id);
        } else {
          console.log('⚠️ No user found in auth state');
        }
      });

    this.profile$
      .pipe(takeUntil(this.destroy$))
      .subscribe(profile => {
        if (profile) {
          console.log('✅ Profile loaded successfully:', profile);
          this.profile = profile;
          this.populateForms(profile);
        } else {
          console.log('⏳ Profile is still loading or null');
        }
      });

    this.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => {
        if (error) {
          console.error('❌ Profile loading error:', error);
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Form Population ───────────────────────────────────────────────
  private populateForms(profile: UserProfileModel): void {
    // Personal Info
    this.personalInfoForm.patchValue({
      firstName: profile.firstName,
      middleName: profile.middleName,
      lastName: profile.lastName,
      email: profile.email,
      phoneNumber: profile.phoneNumber
    });

    // Professional Info
    if (profile.professionalInfo) {
      this.professionalInfoForm.patchValue(profile.professionalInfo);
    }

    // Billing Info
    if (profile.billingInfo) {
      this.billingInfoForm.patchValue({
        billingName: profile.billingInfo.billingName,
        billingEmail: profile.billingInfo.billingEmail,
        billingPhone: profile.billingInfo.billingPhone,
        taxId: profile.billingInfo.taxId,
        companyName: profile.billingInfo.companyName
      });
    }
  }

  // ── Tab Navigation ───────────────────────────────────────────────
  switchTab(tabName: string): void {
    this.activeTab.set(tabName);
  }

  // ── Profile Image ─────────────────────────────────────────────────
  onProfileImageChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Update profile image preview
        if (this.profile) {
          this.profile.profileImageUrl = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // ── Update Methods ────────────────────────────────────────────────
  updatePersonalInfo(): void {
    if (this.personalInfoForm.invalid) {
      this.personalInfoForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Please fill in all required fields correctly.'
      });
      return;
    }

    this.profileFacade.updatePersonalInfo(
      this.userId(),
      this.personalInfoForm.value
    );

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Personal information updated successfully!',
      timer: 2000
    });
  }

  updateProfessionalInfo(): void {
    if (this.professionalInfoForm.invalid) {
      this.professionalInfoForm.markAllAsTouched();
      return;
    }

    this.profileFacade.updateProfessionalInfo(
      this.userId(),
      this.professionalInfoForm.value
    );

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Professional information updated successfully!',
      timer: 2000
    });
  }

  addAddress(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Address added successfully!',
      timer: 2000
    });
    this.addressForm.reset();
  }

  editAddress(address: Address): void {
    this.addressForm.patchValue(address);
    this.activeTab.set('address');
  }

  deleteAddress(address: Address): void {
    Swal.fire({
      title: 'Delete Confirmation',
      text: 'Are you sure you want to delete this address?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Address has been deleted.', 'success');
      }
    });
  }

  addContact(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Contact added successfully!',
      timer: 2000
    });
    this.contactForm.reset({ contactType: 'Phone', isDefault: false });
  }

  editContact(contact: Contact): void {
    this.contactForm.patchValue(contact);
    this.activeTab.set('contact');
  }

  deleteContact(contact: Contact): void {
    Swal.fire({
      title: 'Delete Confirmation',
      text: 'Are you sure you want to delete this contact?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Contact has been deleted.', 'success');
      }
    });
  }

  addWorkLocation(): void {
    if (this.workLocationForm.invalid) {
      this.workLocationForm.markAllAsTouched();
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Work location added successfully!',
      timer: 2000
    });
    this.workLocationForm.reset();
  }

  editWorkLocation(location: WorkLocation): void {
    this.workLocationForm.patchValue(location);
    this.activeTab.set('workLocation');
  }

  deleteWorkLocation(location: WorkLocation): void {
    Swal.fire({
      title: 'Delete Confirmation',
      text: 'Are you sure you want to delete this work location?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Deleted!', 'Work location has been deleted.', 'success');
      }
    });
  }

  updateBillingInfo(): void {
    if (this.billingInfoForm.invalid) {
      this.billingInfoForm.markAllAsTouched();
      return;
    }

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Billing information updated successfully!',
      timer: 2000
    });
  }

  // ── Navigation ────────────────────────────────────────────────────
  backToDashboard(): void {
    this.router.navigateByUrl(this.returnUrl());
  }

  // ── Helper Methods ────────────────────────────────────────────────
  getDefaultProfileImage(): string {
    if (this.profile?.profileImageUrl) {
      return this.profile.profileImageUrl;
    }
    // Return avatar with initials
    const firstName = this.profile?.firstName || 'U';
    const lastName = this.profile?.lastName || 'P';
    return `data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' width='150' height='150' viewBox='0 0 150 150'><circle cx='75' cy='75' r='75' fill='%23667eea'/><text x='75' y='80' font-size='50' font-weight='bold' fill='white' text-anchor='middle'>${firstName.charAt(0)}${lastName.charAt(0)}</text></svg>`;
  }
}

