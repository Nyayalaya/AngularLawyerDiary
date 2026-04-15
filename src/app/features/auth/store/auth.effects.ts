// src/app/features/auth/store/auth.effects.ts

import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, exhaustMap, map, tap } from 'rxjs/operators';

import { AuthService } from '../../../core';
import { TokenService } from '../../../core/services/token.service';
import { TokenExpiryService } from '../../../core/services/token-expiry.service';
import { AuthUser, UserRole } from '../models/login-response.model';
import * as A from './auth.actions';

const ROLE_ROUTES: Record<UserRole, string> = {
  superadmin: '/admin/dashboard',
  lawyer: '/lawyer/dashboard',
  client: '/client/dashboard',
  corporate: '/corporate/dashboard',
};

@Injectable()
export class AuthEffects {

  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private tokenSvc = inject(TokenService);
  private expirySvc = inject(TokenExpiryService);
  private router = inject(Router);

  /* =====================================================
     1. LOGIN
  ===================================================== */
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loginRequest),
      exhaustMap(({ credentials }) =>
        this.authService.login(credentials).pipe(
          map((res) => {

            const user: AuthUser = {
              id: res.id,
              name: res.userName,
              email: res.email,
              role: (res.roles?.[0] ?? 'client').toLowerCase() as UserRole
            };

            return A.loginSuccess({
              user,
              token: res.jwToken,
              expiresAt: new Date(res.expiresOn).getTime()
            });
          }),
          catchError(err =>
            of(A.loginFailure({
              error: err.error?.message ?? 'Login failed'
            }))
          )
        )
      )
    )
  );

  /* =====================================================
     2. LOGIN SUCCESS
  ===================================================== */
  loginSuccess$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loginSuccess),
      tap(({ user, token, expiresAt }) => {

        const rememberMe = false;

        this.tokenSvc.save(
          { token, expiresAt, user },
          rememberMe
        );

        this.expirySvc.startWatching();

        const route = ROLE_ROUTES[user.role] ?? '/dashboard';
        this.router.navigate([route]);
      })
    ),
    { dispatch: false }
  );

  /* =====================================================
     3. LOGOUT (JWT ONLY)
  ===================================================== */
  logout$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.logout),
      tap(() => {
        this.tokenSvc.clear();
        this.expirySvc.stopWatching();

        // Hard redirect (clears app state fully)
        window.location.href = '/auth/login';
      }),
      map(() => A.logoutSuccess())
    )
  );

  /* =====================================================
     4. REHYDRATE (APP LOAD)
  ===================================================== */
  rehydrate$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.rehydrateAuth),
      tap(() => {
        this.expirySvc.startWatching();
      })
    ),
    { dispatch: false }
  );

}
