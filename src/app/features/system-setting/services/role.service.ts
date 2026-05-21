import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { ApiEndpoints } from '../../../core';
import { ApiResponse, BaseCrudService } from '../../../core/services/base-crud.service';
import { Permission, Role, RolePermissionUpdate } from '../models/role.model';

@Injectable({ providedIn: 'root' })
export class RoleService extends BaseCrudService<Role> {
  protected endpoint = ApiEndpoints.ROLE.BASE_CONTROLLER_URL;

  getPermissionsByRole(roleId: string): Observable<Permission[]> {
    return this.get<ApiResponse<Permission[]> | Permission[]>(
      ApiEndpoints.ROLE.PERMISSIONS.replace('{{role_id}}', roleId)
    ).pipe(
      map(response => Array.isArray(response) ? response : response.data)
    );
  }

  updateRolePermissions(payload: RolePermissionUpdate): Observable<void> {
    return this.post<void>(
      ApiEndpoints.ROLE.UPDATE_PERMISSIONS.replace('{{role_id}}', payload.roleId),
      { permissionIds: payload.permissionIds }
    );
  }
}
