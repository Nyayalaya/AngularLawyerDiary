// src/app/core/interceptors/auth.interceptor.ts

import {
  HttpInterceptorFn,
  HttpErrorResponse,
  HttpRequest
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { catchError, throwError, timeout } from 'rxjs';

import { TokenService } from '../services/token.service';
import { logout } from '../../features/auth/store/auth.actions';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const tokenSvc = inject(TokenService);
  const store = inject(Store);
  const token = tokenSvc.getAccessToken();

  /* =========================
     1. Skip public & static requests
  ========================= */
  if (isPublicRequest(req)) {
    return next(req);
  }

  /* =========================
     2. ALWAYS overwrite Authorization header
  ========================= */
  let authReq: HttpRequest<any> = req;

  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  /* =========================
     3. Send request
  ========================= */
  return next(authReq).pipe(

    timeout(30000),

    catchError((err: HttpErrorResponse) => {

      /* =========================
         AUTH ERRORS
      ========================= */
      if (err.status === 401) {
        store.dispatch(logout());
      }

      if (err.status === 403) {
        console.warn('[AuthInterceptor] Forbidden:', authReq.url);
      }

      /* =========================
         NETWORK ERROR
      ========================= */
      if (err.status === 0) {
        console.error('[AuthInterceptor] Network/CORS issue');
      }

      /* =========================
         DEBUG (DEV ONLY)
      ========================= */
      if (!isProduction()) {
        console.error('[HTTP ERROR]', {
          url: authReq.url,
          status: err.status,
          message: err.message,
          tokenLength: token?.length
        });
      }

      return throwError(() => err);
    })
  );
};


/* =========================
   Helper: Public Requests
========================= */
function isPublicRequest(req: HttpRequest<any>): boolean {

  const publicUrls = [
    '/auth/login',
    '/auth/register'
  ];

  if (req.url.includes('/assets') || req.url.includes('.json')) {
    return true;
  }
  console.log('Interceptor running:', req.url);
  return publicUrls.some(url => req.url.includes(url));
}


/* =========================
   Helper: Environment
========================= */
function isProduction(): boolean {
  return !location.hostname.includes('localhost');
}
