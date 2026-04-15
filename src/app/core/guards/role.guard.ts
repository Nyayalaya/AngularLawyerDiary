// src/app/core/guards/role.guard.ts
import { inject }            from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store }             from '@ngrx/store';
import { combineLatest }     from 'rxjs';
import { map, take }         from 'rxjs/operators';
import { selectIsLoggedIn, selectUserRole } from '../../features/auth/store/auth.selectors';
import { UserRole }          from '../../features/auth/models/login-response.model';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store        = inject(Store);
  const router       = inject(Router);
  const allowedRoles = route.data['roles'] as UserRole[];

  return combineLatest([
    store.select(selectIsLoggedIn),
    store.select(selectUserRole),
  ]).pipe(
    take(1),
    map(([isLoggedIn, role]) => {
      if (!isLoggedIn)
        return router.createUrlTree(['/auth/login']);
      if (!role || !allowedRoles.includes(role))
        return router.createUrlTree(['/unauthorized']);
      return true;
    })
  );
};