export interface Role {
  id: string;
  name: string;
}

export interface Permission {
  id: string;
  permissionName: string;
  selected?: boolean;
}

export interface RolePermissionUpdate {
  roleId: string;
  permissionIds: string[];
}
