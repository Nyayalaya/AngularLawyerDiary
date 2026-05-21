import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ProfileState } from './profile.state';

// Feature selector
export const selectProfileFeature = createFeatureSelector<ProfileState>('profile');

// Individual selectors
export const selectProfile = createSelector(
  selectProfileFeature,
  (state: ProfileState) => state.profile
);

export const selectLoading = createSelector(
  selectProfileFeature,
  (state: ProfileState) => state.loading
);

export const selectLoaded = createSelector(
  selectProfileFeature,
  (state: ProfileState) => state.loaded
);

export const selectError = createSelector(
  selectProfileFeature,
  (state: ProfileState) => state.error
);

export const selectLastFetched = createSelector(
  selectProfileFeature,
  (state: ProfileState) => state.lastFetched
);

// Derived selectors
export const selectProfilePersonalInfo = createSelector(
  selectProfile,
  (profile) => profile ? {
    firstName: profile.firstName,
    middleName: profile.middleName,
    lastName: profile.lastName,
    fullName: profile.fullName,
    email: profile.email,
    phoneNumber: profile.phoneNumber,
    profileImageUrl: profile.profileImageUrl
  } : null
);

export const selectProfileProfessionalInfo = createSelector(
  selectProfile,
  (profile) => profile?.professionalInfo || null
);

export const selectProfileAddresses = createSelector(
  selectProfile,
  (profile) => profile?.addresses || []
);

export const selectProfileContacts = createSelector(
  selectProfile,
  (profile) => profile?.contacts || []
);

export const selectProfileWorkLocations = createSelector(
  selectProfile,
  (profile) => profile?.workLocations || []
);

export const selectProfileBillingInfo = createSelector(
  selectProfile,
  (profile) => profile?.billingInfo || null
);
