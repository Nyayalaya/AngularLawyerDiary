// src/app/core/guards/role.guard.ts
import { inject }            from '@angular/core';
import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Store }             from '@ngrx/store';
import { combineLatest }     from 'rxjs';
import { map, take }         from 'rxjs/operators';
import { selectIsLoggedIn, selectUserRole } from '../../features/auth/store/auth.selectors';
import { TokenService }      from '../services/token.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const store        = inject(Store);
  const router       = inject(Router);
  const tokenSvc     = inject(TokenService);
  const allowedRoles = ((route.data['roles'] as string[]) ?? [])
    .map(role => role.toLowerCase());

  return combineLatest([
    store.select(selectIsLoggedIn),
    store.select(selectUserRole),
  ]).pipe(
    take(1),
    map(([isLoggedIn, role]) => {
      const authData = tokenSvc.getAuthData();
      const hasStoredSession = !!authData && authData.expiresAt > Date.now();
      const effectiveRole = role ?? authData?.user?.role ?? null;

      if (!isLoggedIn && !hasStoredSession)
        return router.createUrlTree(['/default']);
      if (!effectiveRole)
        return router.createUrlTree(['/unauthorized']);

      const normalizedRole = effectiveRole.toLowerCase();
      if (allowedRoles.length && !allowedRoles.includes(normalizedRole))
        return router.createUrlTree(['/unauthorized']);

      return true;
    })
  );
};
