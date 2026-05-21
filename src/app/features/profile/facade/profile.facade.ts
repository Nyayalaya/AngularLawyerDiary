import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { UserProfileModel } from '../../../core/models/profile.model';
import * as ProfileActions from '../../../store/profile/profile.actions';
import * as ProfileSelectors from '../../../store/profile/profile.selectors';

@Injectable({
  providedIn: 'root'
})
export class ProfileFacade {

  private store = inject(Store);

  // ── Public Observables ────────────────────────────────────────────
  profile$: Observable<UserProfileModel | null> = this.store.select(ProfileSelectors.selectProfile);
  loading$: Observable<boolean> = this.store.select(ProfileSelectors.selectLoading);
  loaded$: Observable<boolean> = this.store.select(ProfileSelectors.selectLoaded);
  error$: Observable<string | null> = this.store.select(ProfileSelectors.selectError);
  
  personalInfo$: Observable<any> = this.store.select(ProfileSelectors.selectProfilePersonalInfo);
  professionalInfo$: Observable<any> = this.store.select(ProfileSelectors.selectProfileProfessionalInfo);
  addresses$: Observable<any[]> = this.store.select(ProfileSelectors.selectProfileAddresses);
  contacts$: Observable<any[]> = this.store.select(ProfileSelectors.selectProfileContacts);
  workLocations$: Observable<any[]> = this.store.select(ProfileSelectors.selectProfileWorkLocations);
  billingInfo$: Observable<any> = this.store.select(ProfileSelectors.selectProfileBillingInfo);

  // ── Public Methods ────────────────────────────────────────────────

  /**
   * Load user profile by userId
   */
  loadProfile(userId: string, force: boolean = false): void {
    this.store.dispatch(ProfileActions.loadProfile({ userId, force }));
  }

  /**
   * Update entire profile
   */
  updateProfile(profile: UserProfileModel): void {
    this.store.dispatch(ProfileActions.updateProfile({ profile }));
  }

  /**
   * Update personal information only
   */
  updatePersonalInfo(userId: string, data: any): void {
    this.store.dispatch(ProfileActions.updatePersonalInfo({ userId, data }));
  }

  /**
   * Update professional information only
   */
  updateProfessionalInfo(userId: string, data: any): void {
    this.store.dispatch(ProfileActions.updateProfessionalInfo({ userId, data }));
  }

  /**
   * Clear profile from state
   */
  clearProfile(): void {
    this.store.dispatch(ProfileActions.clearProfile());
  }
}
