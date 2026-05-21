import { Injectable } from '@angular/core';
import { ApiEndpoints } from '../../../core';
import { ApiResponse, BaseCrudService } from '../../../core/services/base-crud.service';
import { SystemUser } from '../models/system-user.model';

@Injectable({ providedIn: 'root' })
export class SystemUserService extends BaseCrudService<SystemUser> {
  protected endpoint = ApiEndpoints.SYSTEM_USERS.BASE_CONTROLLER_URL;

  override getAll(pageNumber = 1, pageSize = 10) {
    return super.getAll(pageNumber, pageSize);
  }

  updateUser(user: Partial<SystemUser> & { id: string }) {
    return this.update(user);
  }
}
