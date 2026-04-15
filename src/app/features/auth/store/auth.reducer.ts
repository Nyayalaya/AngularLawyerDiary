import { createReducer, on } from '@ngrx/store';
import * as A from './auth.actions';
import { initialAuthState } from './auth.state';

export const authReducer = createReducer(

  initialAuthState,

  // ── LOGIN ─────────────────────────────────────────────
  on(A.loginRequest, (state) => ({
    ...state,
    loading: true,
    error: null,

    // ✅ clear old session
    user: null,
    token: null,
    expiresAt: null,
    isLoggedIn: false
  })),

  on(A.loginSuccess, (state, { user, token, expiresAt }) => ({
    ...state,
    loading: false,

    user,
    token,
    expiresAt,

    isLoggedIn: true,
    error: null
  })),

  on(A.loginFailure, (state, { error }) => ({
    ...state,
    loading: false,
    isLoggedIn: false,
    error
  })),

  // ── REGISTER ─────────────────────────────────────────
  on(A.registerRequest, (state) => ({
    ...state,
    registering: true,
    registerError: null
  })),

  on(A.registerSuccess, (state, { userId }) => ({
    ...state,
    registering: false,
    registeredUserId: userId
  })),

  on(A.registerFailure, (state, { error }) => ({
    ...state,
    registering: false,
    registerError: error
  })),

  // ── REFRESH TOKEN ────────────────────────────────────
  on(A.refreshTokenSuccess, (state, { response, expiresAt }) => ({
    ...state,
    token: response.jwToken,
    expiresAt,
    isLoggedIn: true
  })),

  // ── REHYDRATE (APP LOAD) ─────────────────────────────
  on(A.rehydrateAuth, (state, { response, rememberMe, expiresAt }) => ({
    ...state,
    user: null,
    token: response.jwToken,
    expiresAt,
    rememberMe,

    isLoggedIn: true,
    error: null
  })),

  // ── LOGOUT ───────────────────────────────────────────
  on(A.logoutSuccess, () => ({
    ...initialAuthState
  }))
);