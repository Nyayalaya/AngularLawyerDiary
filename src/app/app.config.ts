
import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';

import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core';

import { courtTypeReducer } from './features/masters/store/court-type/court-type.reducer';
import { CourtTypeEffects } from './features/masters/store/court-type/court-type.effects';

import { authReducer } from './features/auth/store/auth.reducer';
import { AuthEffects } from './features/auth/store/auth.effects';
import { stateReducer } from './features/masters/store/state-view/m-state.reducer';
import { StateEffects } from './features/masters/store/state-view/m-state.effects';
import { caseStageReducer } from './features/masters/store/case-stage/case-stage.reducer';
import { CaseStageEffects } from './features/masters/store/case-stage/case-stage.effects';
import { courtLevelReducer } from './features/masters/store/court-level/court-level.reducer';
import { CourtLevelEffects } from './features/masters/store/court-level/court-level.effects';
import { caseCategoryReducer } from './features/masters/store/case-category/case-category.reducer';
import { CaseCategoryEffects } from './features/masters/store/case-category/case-category.effects';
import { cadreReducer } from './features/masters/store/cadre/cadre.reducer';
import { CadreEffects } from './features/masters/store/cadre/cadre.effects';
import { courtDistrictReducer } from './features/masters/store/court-district/court-district.reducer';
import { CourtDistrictEffects } from './features/masters/store/court-district/court-district.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),

    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    provideStore({
      courtType:      courtTypeReducer,
      state:          stateReducer,
      caseStage:      caseStageReducer,
      courtLevel:     courtLevelReducer,
      caseCategory:   caseCategoryReducer,
      cadre:          cadreReducer,
      courtDistrict:  courtDistrictReducer,
      auth:           authReducer
    }),

    provideEffects([
      AuthEffects, 
      CourtTypeEffects, 
      StateEffects, 
      CaseStageEffects, 
      CourtLevelEffects, 
      CaseCategoryEffects, 
      CadreEffects, 
      CourtDistrictEffects
    ])
  ]
};