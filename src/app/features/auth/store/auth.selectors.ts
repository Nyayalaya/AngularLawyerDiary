// src/app/features/auth/store/auth.selectors.ts
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

// Login
export const selectIsLoggedIn   = createSelector(selectAuthState, s => s.isLoggedIn);
export const selectCurrentUser  = createSelector(selectAuthState, s => s.user);
export const selectUserRole     = createSelector(selectAuthState, s => s.user?.role ?? null);
export const selectAuthToken    = createSelector(selectAuthState, s => s.token);
export const selectAuthLoading  = createSelector(selectAuthState, s => s.loading);
export const selectAuthError    = createSelector(selectAuthState, s => s.error);


// Register
export const selectRegistering      = createSelector(selectAuthState, s => s.registering);
export const selectRegisterError    = createSelector(selectAuthState, s => s.registerError);
export const selectRegisteredUserId = createSelector(selectAuthState, s => s.registeredUserId);