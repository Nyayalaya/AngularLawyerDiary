// src/app/features/auth/services/auth.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

import { BaseService } from './base-service';
import { ApiEndpoints } from '../constants';
import { ApiResponse } from '../models/api-response.model';
import { LoginRequest } from '../../features/auth/models/login-request.model';
import { LoginResponse } from '../models';
import { RegisterRequest } from '../../features/auth/models/register-request.model';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {

  constructor(http: HttpClient) {
    super(http);   // No Router here — navigation belongs in Effects
  }

  // ── Login → returns LoginResponse (data part only) ────────────────────
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.post<ApiResponse<LoginResponse>>(
      ApiEndpoints.AUTH.LOGIN,
      credentials,
    ).pipe(
      map(res => res.data)
    );
  }

  // ── Register → returns userId string (data part only) ─────────────────
  register(userData: RegisterRequest): Observable<string> {
    return this.post<ApiResponse<string>>(
      ApiEndpoints.AUTH.REGISTER,
      userData
    ).pipe(
      map(res => res.data)
    );
  }

  // ── Refresh Token → accepts token from TokenService via Effect ─────────
  refreshToken(refreshToken: string): Observable<LoginResponse> {
    return this.post<ApiResponse<LoginResponse>>(
      ApiEndpoints.AUTH.REFRESH_TOKEN,
      { refreshToken }
    ).pipe(
      map(res => res.data)
    );
  }

  // ── Logout → Observable so Effect can sequence API → clear → navigate ──
  logout(): Observable<void> {
    return this.post<ApiResponse<void>>(
      ApiEndpoints.AUTH.LOGOUT,
      {},
      
    ).pipe(
      map(() => void 0)
    );
  }
}