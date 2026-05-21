import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { SystemUser } from '../models/system-user.model';
import { SystemUserService } from '../services/system-user.service';

@Injectable({ providedIn: 'root' })
export class SystemUserFacade {
  private systemUserService = inject(SystemUserService);

  loadUsers(pageNumber = 1, pageSize = 10): Observable<SystemUser[]> {
    return this.systemUserService.getAll(pageNumber, pageSize).pipe(
      map(response => response.data ?? [])
    );
  }

  saveUser(user: SystemUser): Observable<SystemUser> {
    return user.id ? this.systemUserService.update(user) : this.systemUserService.create(user);
  }

  updateUser(user: Partial<SystemUser> & { id: string }): Observable<SystemUser> {
    return this.systemUserService.updateUser(user);
  }

  deleteUser(id: string): Observable<void> {
    return this.systemUserService.deleteById(id);
  }
}
