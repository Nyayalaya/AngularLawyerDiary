import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { BaseService } from './base-service';
import { ApiEndpoints } from '../constants';
import { StorageKeys } from '../constants';
import { RoutePath } from '../constants';
import {
  LoginRequest,
  ApiResponse,
  RegisterRequest,
  AuthResponse,
  User
} from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService extends BaseService {

  private currentUserSubject: BehaviorSubject<User | null>;
  public currentUser$: Observable<User | null>;
  private tokenExpirationTimer: any;

  constructor(http: HttpClient,private router: Router) {
    super(http);
    const storedUser = this.getUserFromStorage();
    this.currentUserSubject = new BehaviorSubject<User | null>(storedUser);
    this.currentUser$ = this.currentUserSubject.asObservable();

    if (storedUser) {
      this.setTokenExpirationTimer();
    }
  }

  /* =======================
     AUTH STATE
  ======================= */

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem(StorageKeys.ACCESS_TOKEN);
  }

  /* =======================
     API CALLS
  ======================= */

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.post<ApiResponse<AuthResponse>>(ApiEndpoints.AUTH.LOGIN,credentials,false)
    .pipe(
      map(res => res.data),
      tap(authData => this.handleAuthSuccess(authData))
    );
  }

  register(userData: RegisterRequest): Observable<AuthResponse> {
    return this.post<ApiResponse<AuthResponse>>(ApiEndpoints.AUTH.REGISTER,userData,false).pipe(
      map(res => res.data),
      tap(authData => this.handleAuthSuccess(authData))
    );
  }

  refreshToken(): Observable<AuthResponse> 
  {
    const refreshToken = localStorage.getItem(StorageKeys.REFRESH_TOKEN);

    return this.post<ApiResponse<AuthResponse>>(
      ApiEndpoints.AUTH.REFRESH_TOKEN,
      { refreshToken },
      false
    ).pipe(
      map(res => res.data),
      tap(authData => this.handleAuthSuccess(authData))
    );
  }

  logout(): void {
    this.clearAuthData();
    this.currentUserSubject.next(null);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.router.navigate([RoutePath.LOGIN]);
  }

  /* =======================
     PRIVATE HELPERS
  ======================= */

  private handleAuthSuccess(authData: AuthResponse): void {
    localStorage.setItem(StorageKeys.ACCESS_TOKEN, authData.token);
    localStorage.setItem(StorageKeys.REFRESH_TOKEN, authData.refreshToken);
    localStorage.setItem(StorageKeys.TOKEN_EXPIRY, authData.expiresAt);

    const user: User = {
      userId: authData.userId,
      email: authData.email,
      fullName: authData.fullName,
      role: authData.role,
      isProfileComplete: authData.isProfileComplete
    };

    localStorage.setItem(StorageKeys.CURRENT_USER, JSON.stringify(user));
    this.currentUserSubject.next(user);

    this.setTokenExpirationTimer();
  }

  private setTokenExpirationTimer(): void {
    const expiry = localStorage.getItem(StorageKeys.TOKEN_EXPIRY);
    if (!expiry) return;

    const expiresAt = new Date(expiry).getTime();
    const now = Date.now();
    const timeout = expiresAt - now - 60_000; // 1 min before expiry

    if (timeout > 0) {
      this.tokenExpirationTimer = setTimeout(() => this.logout(), timeout);
    } else {
      this.logout();
    }
  }

  private getUserFromStorage(): User | null {
    const json = localStorage.getItem(StorageKeys.CURRENT_USER);
    if (!json) return null;

    try {
      return JSON.parse(json) as User;
    } catch {
      return null;
    }
  }
  getAccessToken(): string | null {
  return localStorage.getItem(StorageKeys.ACCESS_TOKEN);
}

  private clearAuthData(): void {
    localStorage.removeItem(StorageKeys.ACCESS_TOKEN);
    localStorage.removeItem(StorageKeys.REFRESH_TOKEN);
    localStorage.removeItem(StorageKeys.TOKEN_EXPIRY);
    localStorage.removeItem(StorageKeys.CURRENT_USER);
  }
}
