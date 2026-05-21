import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { Permission, Role, RolePermissionUpdate } from '../models/role.model';
import { RoleService } from '../services/role.service';

@Injectable({ providedIn: 'root' })
export class RoleFacade {
  private roleService = inject(RoleService);

  loadRoles(pageNumber = 1, pageSize = 1000): Observable<Role[]> {
    return this.roleService.getAll(pageNumber, pageSize).pipe(
      map(response => response.data ?? [])
    );
  }

  addRole(role: Role): Observable<Role> {
    return this.roleService.create(role);
  }

  updateRole(role: Role): Observable<Role> {
    return this.roleService.update(role);
  }

  saveRole(role: Role): Observable<Role> {
    return role.id ? this.updateRole(role) : this.addRole(role);
  }

  loadPermissionsByRole(roleId: string): Observable<Permission[]> {
    return this.roleService.getPermissionsByRole(roleId);
  }

  updateRolePermissions(payload: RolePermissionUpdate): Observable<void> {
    return this.roleService.updateRolePermissions(payload);
  }
}
