import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, mergeMap, of, switchMap } from 'rxjs';

import * as A from './profile.actions';
import { ProfileService } from '../../core/services/profile.service';

@Injectable()
export class ProfileEffects {

  private actions$ = inject(Actions);
  private service = inject(ProfileService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.loadProfile),
      switchMap(action =>
        this.service.getUserProfile(action.userId).pipe(
          map(res => A.loadProfileSuccess({ profile: res.data })),
          catchError(error =>
            of(A.loadProfileFailure({ error: error.message || 'Failed to load profile' }))
          )
        )
      )
    )
  );

  update$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateProfile),
      mergeMap(action =>
        this.service.updateProfile(action.profile).pipe(
          map(res => A.updateProfileSuccess({ profile: res.data })),
          catchError(error =>
            of(A.updateProfileFailure({ error: error.message || 'Failed to update profile' }))
          )
        )
      )
    )
  );

  updatePersonalInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updatePersonalInfo),
      mergeMap(action =>
        this.service.updatePersonalInfo(action.userId, action.data).pipe(
          map(res => A.updatePersonalInfoSuccess({ profile: res.data })),
          catchError(error =>
            of(A.updatePersonalInfoFailure({ error: error.message || 'Failed to update personal info' }))
          )
        )
      )
    )
  );

  updateProfessionalInfo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(A.updateProfessionalInfo),
      mergeMap(action =>
        this.service.updateProfessionalInfo(action.userId, action.data).pipe(
          map(res => A.updateProfessionalInfoSuccess({ profile: res.data })),
          catchError(error =>
            of(A.updateProfessionalInfoFailure({ error: error.message || 'Failed to update professional info' }))
          )
        )
      )
    )
  );
}
