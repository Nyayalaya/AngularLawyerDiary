import { createAction, props } from '@ngrx/store';
import { LoginRequest } from '../models/login-request.model';
import { RegisterRequest } from '../models/register-request.model';
import { AuthUser, LoginResponse } from '../models/login-response.model';


export const loginRequest = createAction(
  '[Auth] Login Request', 
  props<{ credentials: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{
    user: AuthUser;
    token: string;
    expiresAt: number;
  }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: string }>()   
);


export const registerRequest = createAction(
  '[Auth] Register Request',
  props<{ userData: RegisterRequest }>()  
);


export const registerSuccess = createAction(
  '[Auth] Register Success',
  props<{ userId: string }>()
);


export const registerFailure = createAction(
  '[Auth] Register Failure',
  props<{ error: string }>()   
);


export const refreshTokenRequest = createAction(
  '[Auth] Refresh Token Request'
);

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ response: LoginResponse; expiresAt: number }>()
);

export const refreshTokenFailure = createAction(
  '[Auth] Refresh Token Failure',
  props<{ error: string }>()  
);

export const logout = createAction('[Auth] Logout');

export const logoutSuccess = createAction('[Auth] Logout Success');

export const sessionExpiring = createAction('[Auth] Session Expiring');

// ✅ restores full auth state from localStorage/sessionStorage on app start
export const rehydrateAuth = createAction(
  '[Auth] Rehydrate',
  props<{ response: LoginResponse; rememberMe: boolean; expiresAt: number }>()
);

