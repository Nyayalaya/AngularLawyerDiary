import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../store/auth.actions';
import * as AuthSelectors from '../store/auth.selectors';
import { Observable } from 'rxjs';
import { AuthUser } from '../models/login-response.model';
import { LoginRequest } from '../models/login-request.model';
import { RegisterRequest } from '../models/register-request.model';

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  user$!: Observable<AuthUser | null>;
  isAuthenticated$!: Observable<boolean>;
  loading$!: Observable<boolean>;
  error$!: Observable<any>;

  constructor(private store: Store) {
    this.user$ = this.store.select(AuthSelectors.selectCurrentUser);
    this.isAuthenticated$ = this.store.select(AuthSelectors.selectIsLoggedIn);
    this.loading$ = this.store.select(AuthSelectors.selectAuthLoading);
    this.error$ = this.store.select(AuthSelectors.selectAuthError);
  }

  login(credentials: LoginRequest) {
    this.store.dispatch(AuthActions.loginRequest({ credentials }));
  }

  register(data: RegisterRequest) {
    this.store.dispatch(AuthActions.registerRequest({ userData: data }));
  }

  refreshToken() {
    this.store.dispatch(AuthActions.refreshTokenRequest());
  }

  logout() {
    this.store.dispatch(AuthActions.logout());
  }
}
