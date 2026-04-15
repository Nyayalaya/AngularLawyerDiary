// src/app/core/services/token.service.ts

import { Injectable } from '@angular/core';
import { AuthUser } from '../../features/auth/models/login-response.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  private readonly ACCESS_TOKEN = 'ACCESS_TOKEN';
  private readonly EXPIRES_AT = 'EXPIRES_AT';
  private readonly USER = 'USER';

  /* =========================================
     SAVE TOKEN
  ========================================= */
  save(data: {
    token: string;
    expiresAt: number;
    user: AuthUser;
  }, rememberMe: boolean): void {

    const storage = rememberMe ? localStorage : sessionStorage;

    storage.setItem(this.ACCESS_TOKEN, data.token);
    storage.setItem(this.EXPIRES_AT, data.expiresAt.toString());
    storage.setItem(this.USER, JSON.stringify(data.user));
  }

  /* =========================================
     GET TOKEN
  ========================================= */
  getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN)
        || sessionStorage.getItem(this.ACCESS_TOKEN);
  }

  /* =========================================
     GET EXPIRY
  ========================================= */
  getExpiry(): number | null {
    const val = localStorage.getItem(this.EXPIRES_AT)
      || sessionStorage.getItem(this.EXPIRES_AT);

    return val ? Number(val) : null;
  }

  /* =========================================
     GET USER
  ========================================= */
  getUser(): AuthUser | null {
    const data = localStorage.getItem(this.USER)
      || sessionStorage.getItem(this.USER);

    return data ? JSON.parse(data) : null;
  }

  /* =========================================
     CLEAR SESSION
  ========================================= */
  clear(): void {
    localStorage.removeItem(this.ACCESS_TOKEN);
    localStorage.removeItem(this.EXPIRES_AT);
    localStorage.removeItem(this.USER);

    sessionStorage.removeItem(this.ACCESS_TOKEN);
    sessionStorage.removeItem(this.EXPIRES_AT);
    sessionStorage.removeItem(this.USER);
  }

  /* =========================================
     REHYDRATE SUPPORT
  ========================================= */
  getAuthData() {
    const token = this.getAccessToken();
    const expiresAt = this.getExpiry();
    const user = this.getUser();

    if (!token || !expiresAt || !user) return null;

    return { token, expiresAt, user };
  }
}
