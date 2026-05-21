// store/profile/profile.state.ts

import { UserProfileModel } from '../../core/models/profile.model';

export interface ProfileState {
  profile: UserProfileModel | null;
  loading: boolean;
  loaded: boolean;
  error: string | null;
  lastFetched: number | null;
}

export const initialProfileState: ProfileState = {
  profile: null,
  loading: false,
  loaded: false,
  error: null,
  lastFetched: null
};
