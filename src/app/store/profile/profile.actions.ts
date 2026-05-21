import { createAction, props } from '@ngrx/store';
import { UserProfileModel } from '../../core/models/profile.model';

// LOAD
export const loadProfile = createAction(
  '[Profile] Load',
  props<{ userId: string; force?: boolean }>()
);

export const loadProfileSuccess = createAction(
  '[Profile] Load Success',
  props<{ profile: UserProfileModel }>()
);

export const loadProfileFailure = createAction(
  '[Profile] Load Failure',
  props<{ error: string }>()
);

// UPDATE
export const updateProfile = createAction(
  '[Profile] Update',
  props<{ profile: UserProfileModel }>()
);

export const updateProfileSuccess = createAction(
  '[Profile] Update Success',
  props<{ profile: UserProfileModel }>()
);

export const updateProfileFailure = createAction(
  '[Profile] Update Failure',
  props<{ error: string }>()
);

// UPDATE PERSONAL INFO
export const updatePersonalInfo = createAction(
  '[Profile] Update Personal Info',
  props<{ userId: string; data: any }>()
);

export const updatePersonalInfoSuccess = createAction(
  '[Profile] Update Personal Info Success',
  props<{ profile: UserProfileModel }>()
);

export const updatePersonalInfoFailure = createAction(
  '[Profile] Update Personal Info Failure',
  props<{ error: string }>()
);

// UPDATE PROFESSIONAL INFO
export const updateProfessionalInfo = createAction(
  '[Profile] Update Professional Info',
  props<{ userId: string; data: any }>()
);

export const updateProfessionalInfoSuccess = createAction(
  '[Profile] Update Professional Info Success',
  props<{ profile: UserProfileModel }>()
);

export const updateProfessionalInfoFailure = createAction(
  '[Profile] Update Professional Info Failure',
  props<{ error: string }>()
);

// CLEAR PROFILE
export const clearProfile = createAction(
  '[Profile] Clear'
);
