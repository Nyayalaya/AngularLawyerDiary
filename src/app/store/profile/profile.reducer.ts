import { createReducer, on } from '@ngrx/store';
import * as A from './profile.actions';
import { initialProfileState } from './profile.state';

export const profileReducer = createReducer(
  initialProfileState,

  on(A.loadProfile, (state) => ({
    ...state,
    loading: true,
    error: null
  })),

  on(A.loadProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    loading: false,
    loaded: true,
    lastFetched: Date.now()
  })),

  on(A.loadProfileFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),

  on(A.updateProfileSuccess, (state, { profile }) => ({
    ...state,
    profile,
    error: null
  })),

  on(A.updateProfileFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(A.updatePersonalInfoSuccess, (state, { profile }) => ({
    ...state,
    profile,
    error: null
  })),

  on(A.updatePersonalInfoFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(A.updateProfessionalInfoSuccess, (state, { profile }) => ({
    ...state,
    profile,
    error: null
  })),

  on(A.updateProfessionalInfoFailure, (state, { error }) => ({
    ...state,
    error
  })),

  on(A.clearProfile, (state) => ({
    ...state,
    profile: null,
    loaded: false,
    error: null
  }))
);
