
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
import { formTypeReducer } from './features/masters/store/form-type/form-type.reducer';
import { FormTypeEffects } from './features/masters/store/form-type/form-type.effects';
import { formMasterReducer } from './features/masters/store/form-master/form-master.reducer';
import { FormMasterEffects } from './features/masters/store/form-master/form-master.effects';
import { formSubTypeReducer } from './features/masters/store/form-subtype/form-subtype.reducer';
import { FormSubTypeEffects } from './features/masters/store/form-subtype/form-subtype.effects';
import { formTemplateReducer } from './features/masters/store/form-template/form-template.reducer';
import { FormTemplateEffects } from './features/masters/store/form-template/form-template.effects';
import { proceedingTypeReducer } from './features/masters/store/proceeding-type/proceeding-type.reducer';
import { ProceedingTypeEffects } from './features/masters/store/proceeding-type/proceeding-type.effects';
import { proceedingReducer } from './features/masters/store/proceeding/proceeding.reducer';
import { ProceedingEffects } from './features/masters/store/proceeding/proceeding.effects';
import { workTypeReducer } from './features/masters/store/work-type/work-type.reducer';
import { WorkTypeEffects } from './features/masters/store/work-type/work-type.effects';
import { workReducer } from './features/masters/store/work/work.reducer';
import { WorkEffects } from './features/masters/store/work/work.effects';
import { profileReducer } from './store/profile/profile.reducer';
import { ProfileEffects } from './store/profile/profile.effects';
import { courtReducer } from './features/masters/store/court/court.reducer';
import { CourtEffects } from './features/masters/store/court/court.effects';
import { courtComplexReducer } from './features/masters/store/court-complex/court-complex.reducer';
import { CourtComplexEffects } from './features/masters/store/court-complex/court-complex.effects';
import { clientReducer } from './features/lawyer-admin/store/client/client.reducer';
import { ClientEffects } from './features/lawyer-admin/store/client/client.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),

    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor])
    ),

    provideStore({
      court:          courtReducer,
      courtComplex:   courtComplexReducer,
      courtType:      courtTypeReducer,
      state:          stateReducer,
      caseStage:      caseStageReducer,
      courtLevel:     courtLevelReducer,
      caseCategory:   caseCategoryReducer,
      cadre:          cadreReducer,
      courtDistrict:  courtDistrictReducer,
      formType:       formTypeReducer,
      formMaster:     formMasterReducer,
      formSubType:    formSubTypeReducer,
      formTemplate:   formTemplateReducer,
      proceedingType: proceedingTypeReducer,
      proceeding:     proceedingReducer,
      workType:       workTypeReducer,
      work:           workReducer,
      auth:           authReducer,
      profile:        profileReducer,
      client:         clientReducer
    }),

    provideEffects([
      AuthEffects, 
      CourtEffects,
      CourtComplexEffects,
      CourtTypeEffects, 
      StateEffects, 
      CaseStageEffects, 
      CourtLevelEffects, 
      CaseCategoryEffects, 
      CadreEffects, 
      CourtDistrictEffects,
      FormTypeEffects,
      FormMasterEffects,
      FormSubTypeEffects,
      FormTemplateEffects,
      ProceedingTypeEffects,
      ProceedingEffects,
      WorkTypeEffects,
      WorkEffects,
      ProfileEffects,
      ClientEffects
    ])
  ]
};
