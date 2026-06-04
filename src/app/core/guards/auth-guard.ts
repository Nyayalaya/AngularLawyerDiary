// src/app/core/guards/auth.guard.ts
import { inject }            from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store }             from '@ngrx/store';
import { map, take }         from 'rxjs/operators';
import { selectIsLoggedIn }  from '../../features/auth/store/auth.selectors';
import { TokenService } from '../services/token.service';

export const authGuard: CanActivateFn = () => {
  const store    = inject(Store);
  const router   = inject(Router);
  const tokenSvc = inject(TokenService);

  return store.select(selectIsLoggedIn).pipe(
    take(1),
    map(isLoggedIn => {
      const authData = tokenSvc.getAuthData();
      const hasStoredSession = !!authData && authData.expiresAt > Date.now();

      return isLoggedIn || hasStoredSession
        ? true
        : router.createUrlTree(['/default']);
    })
  );
};
