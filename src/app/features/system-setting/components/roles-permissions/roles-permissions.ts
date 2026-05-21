import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { GenericTable, GenericFormModel } from '../../../../shared';
import { RoleFacade } from '../../facade/role.facade';
import { Permission, Role } from '../../models/role.model';

@Component({
  selector: 'app-roles-permissions',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GenericTable, GenericFormModel],
  templateUrl: './roles-permissions.html',
  styleUrls: ['./roles-permissions.css']
})
export class RolesPermissionsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private roleFacade = inject(RoleFacade);

  roles = signal<Role[]>([]);
  permissions = signal<Permission[]>([]);
  selectedPermissionIds = signal<Set<string>>(new Set<string>());
  selectedRole = signal<Role | null>(null);
  loading = signal(false);
  permissionLoading = signal(false);
  showRoleForm = signal(false);
  showPermissionPanel = signal(false);
  isEditMode = signal(false);

  roleForm: FormGroup = this.fb.group({
    id: [''],
    name: ['', [Validators.required, Validators.minLength(2)]]
  });

  columns = [
    { key: 'id', label: 'Id', isKey: true },
    { key: 'name', label: 'Name' }
  ];

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.loading.set(true);
    this.roleFacade.loadRoles().subscribe({
      next: roles => {
        this.roles.set(roles);
        this.loading.set(false);
      },
      error: error => {
        this.loading.set(false);
        Swal.fire('Error', error.message ?? 'Unable to load roles.', 'error');
      }
    });
  }

  openAddRole(): void {
    this.isEditMode.set(false);
    this.roleForm.reset({ id: '', name: '' });
    this.showRoleForm.set(true);
  }

  onEdit(role: Role): void {
    this.isEditMode.set(true);
    this.roleForm.patchValue(role);
    this.showRoleForm.set(true);
  }

  saveRole(): void {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const role = this.roleForm.getRawValue() as Role;

    this.roleFacade.saveRole(role).subscribe({
      next: () => {
        Swal.fire('Success', `Role ${role.id ? 'updated' : 'created'} successfully.`, 'success');
        this.showRoleForm.set(false);
        this.loadRoles();
      },
      error: error => Swal.fire('Error', error.message ?? 'Unable to save role.', 'error')
    });
  }

  onManagePermissions(role: Role): void {
    this.selectedRole.set(role);
    this.showPermissionPanel.set(true);
    this.permissionLoading.set(true);
    this.permissions.set([]);
    this.selectedPermissionIds.set(new Set<string>());

    this.roleFacade.loadPermissionsByRole(role.id).subscribe({
      next: permissions => {
        this.permissions.set(permissions ?? []);
        this.selectedPermissionIds.set(
          new Set((permissions ?? []).filter(permission => permission.selected).map(permission => permission.id))
        );
        this.permissionLoading.set(false);
      },
      error: error => {
        this.permissionLoading.set(false);
        Swal.fire('Error', error.message ?? 'Unable to load permissions.', 'error');
      }
    });
  }

  togglePermission(permission: Permission, checked: boolean): void {
    const selected = new Set(this.selectedPermissionIds());

    if (checked) {
      selected.add(permission.id);
    } else {
      selected.delete(permission.id);
    }

    this.selectedPermissionIds.set(selected);
  }

  isPermissionSelected(permissionId: string): boolean {
    return this.selectedPermissionIds().has(permissionId);
  }

  savePermissions(): void {
    const role = this.selectedRole();
    if (!role) return;

    this.roleFacade.updateRolePermissions({
      roleId: role.id,
      permissionIds: Array.from(this.selectedPermissionIds())
    }).subscribe({
      next: () => {
        Swal.fire('Success', 'Role permissions updated successfully.', 'success');
        this.showPermissionPanel.set(false);
      },
      error: error => Swal.fire('Error', error.message ?? 'Unable to update permissions.', 'error')
    });
  }
}
