import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { GenericTable, GenericFormModel } from '../../../../shared';
import { FeatureFacade } from '../../facade/feature.facade';
import { RoleFacade } from '../../facade/role.facade';
import { SubscriptionPlanFacade } from '../../facade/subscription-plan.facade';
import { SystemUserFacade } from '../../facade/system-user.facade';
import { Feature } from '../../models/feature.model';
import { Role } from '../../models/role.model';
import { SubscriptionPlan } from '../../models/subscription.model';
import { SystemUser } from '../../models/system-user.model';

@Component({
  selector: 'app-system-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericFormModel],
  templateUrl: './system-users.html',
  styleUrls: ['./system-users.css']
  })
export class SystemUsersComponent implements OnInit {
  private fb = inject(FormBuilder);
  private systemUserFacade = inject(SystemUserFacade);
  private featureFacade = inject(FeatureFacade);
  private roleFacade = inject(RoleFacade);
  private subscriptionPlanFacade = inject(SubscriptionPlanFacade);

  users = signal<SystemUser[]>([]);
  features = signal<Feature[]>([]);
  roles = signal<Role[]>([]);
  subscriptionPlans = signal<SubscriptionPlan[]>([]);
  selectedFeatureIds = signal<Set<string>>(new Set<string>());
  selectedUser = signal<SystemUser | null>(null);
  loading = signal(false);
  showUserForm = signal(false);
  isEditMode = signal(false);

  userForm: FormGroup = this.fb.group({
    id: [''],
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    role: ['', [Validators.required]],
    status: [true],
    subscriptionPlanId: ['']
  });

  columns = [
    { key: 'id', label: 'Id', isKey: true, hidden: true },
    { key: 'userType', label: 'User Type' },
    { key: 'firstName', label: 'First Name' },
    { key: 'lastName', label: 'Last Name' },
    { key: 'email', label: 'Email' },
    { key: 'subscription', label: 'Subscription' },
    { key: 'status', label: 'Active' },
    { key: 'subscriptionExpiryDate', label: 'Subscription Expiry Date' },
  ];

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    this.loadFeatures();
    this.loadSubscriptionPlans();
  }

  loadUsers(): void {
    this.loading.set(true);
    this.systemUserFacade.loadUsers().subscribe({
      next: users => {
        this.users.set(users || []);
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        Swal.fire('Error', error.message ?? 'Unable to load users.', 'error');
      }
    });
  }

  loadRoles(): void {
    this.roleFacade.loadRoles().subscribe({
      next: roles => this.roles.set(roles || []),
      error: error => {
        console.error('Unable to load roles', error);
      }
    });
  }

  loadFeatures(): void {
    this.featureFacade.loadFeatures().subscribe({
      next: features => this.features.set(features || []),
      error: error => {
        console.error('Unable to load features', error);
      }
    });
  }

  loadSubscriptionPlans(): void {
    this.subscriptionPlanFacade.loadSubscriptionPlans().subscribe({
      next: plans => this.subscriptionPlans.set(plans || []),
      error: error => {
        console.error('Unable to load subscription plans', error);
      }
    });
  }

  onManage(user: SystemUser): void {
    this.isEditMode.set(true);
    this.selectedUser.set(user);
    this.userForm.patchValue({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      status: user.status,
      subscriptionPlanId: user.subscriptionPlanId ?? ''
    });
    this.selectedFeatureIds.set(new Set(user.featureIds || []));
    this.showUserForm.set(true);
  }

  onDelete(user: SystemUser): void {
    Swal.fire({
      title: 'Confirm removal',
      text: `Remove user ${user.firstName} ${user.lastName} from the system? This cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel'
    }).then(result => {
      if (result.isConfirmed) {
        this.systemUserFacade.deleteUser(user.id).subscribe({
          next: () => {
            Swal.fire('Removed', 'User was removed successfully.', 'success');
            this.loadUsers();
          },
          error: error => Swal.fire('Error', error.message ?? 'Unable to remove user.', 'error')
        });
      }
    });
  }

  toggleAccess(user: SystemUser): void {
    const updatedUser = { id: user.id, status: !user.status } as SystemUser;
    this.systemUserFacade.updateUser(updatedUser).subscribe({
      next: () => {
        Swal.fire('Success', `User access ${user.status ? 'revoked' : 'enabled'} successfully.`, 'success');
        this.loadUsers();
      },
      error: error => Swal.fire('Error', error.message ?? 'Unable to update access.', 'error')
    });
  }

  saveUser(): void {
    if (this.userForm.invalid) {
      this.userForm.markAllAsTouched();
      return;
    }

    const selectedPlan = this.subscriptionPlans().find(plan => plan.id === this.userForm.value.subscriptionPlanId);
    const user = {
      ...this.userForm.getRawValue(),
      featureIds: Array.from(this.selectedFeatureIds()),
      subscriptionPlanName: selectedPlan?.name || ''
    } as SystemUser;

    this.systemUserFacade.saveUser(user).subscribe({
      next: () => {
        Swal.fire('Success', 'User updated successfully.', 'success');
        this.showUserForm.set(false);
        this.loadUsers();
      },
      error: error => Swal.fire('Error', error.message ?? 'Unable to save user.', 'error')
    });
  }

  toggleFeature(featureId: string, checked: boolean): void {
    const selected = new Set(this.selectedFeatureIds());
    if (checked) {
      selected.add(featureId);
    } else {
      selected.delete(featureId);
    }
    this.selectedFeatureIds.set(selected);
  }

  isFeatureSelected(featureId: string): boolean {
    return this.selectedFeatureIds().has(featureId);
  }
}
