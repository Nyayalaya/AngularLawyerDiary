import { AuthUser } from "../models/login-response.model";

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  expiresAt: number | null;

  loading: boolean;
  error: string | null;

  registering: boolean;
  registerError: string | null;
  registeredUserId: string | null;

  isLoggedIn: boolean;
  rememberMe: boolean;
}

/* =========================================================
   INITIAL STATE
========================================================= */
export const initialAuthState: AuthState = {
  user: null,
  token: null,
  expiresAt: null,

  loading: false,
  error: null,

  registering: false,
  registerError: null,
  registeredUserId: null,

  isLoggedIn: false,
  rememberMe: false
};


