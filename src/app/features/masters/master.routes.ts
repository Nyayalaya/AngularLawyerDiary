import { Routes } from '@angular/router';
import { CourtTypeComponent } from './components/court-type/court-type';
import { CaseCategoryComponent } from './components/case-category/case-category';
import { StateView } from './components/state-view/state-view';
import { CaseStageComponent } from './components/case-stage/case-stage';
import { CourtLevelComponent } from './components/court-level/court-level';
import { CadreComponent } from './components/cadre/cadre';
import { CourtDistrictComponent } from './components/court-district/court-district';
import { FormTypeComponent } from './components/form-type/form-type';
import { FormMasterComponent } from './components/form-master/form-master';
import { FormSubTypeComponent } from './components/form-subtype/form-subtype';
import { FormTemplateComponent } from './components/form-template/form-template';
import { ProceedingTypeComponent } from './components/proceeding-type/proceeding-type';
import { ProceedingComponent } from './components/proceeding/proceeding';
import { WorkTypeComponent } from './components/work-type/work-type';
import { WorkComponent } from './components/work/work';
import { CourtComponent } from './components/court/court';
import { CourtComplexComponent } from './components/court-complex/court-complex';


export const masterRoutes: Routes = [
  { path: 'state', component:  StateView },
  { path: 'court-level', component: CourtLevelComponent },
  { path: 'court-type', component:  CourtTypeComponent },
  { path: 'case-category', component: CaseCategoryComponent },
  { path: 'case-stage', component: CaseStageComponent },
  { path: 'cadre', component: CadreComponent },
  { path: 'court-district', component: CourtDistrictComponent },
  { path: 'form-type', component: FormTypeComponent },
  { path: 'form-master', component: FormMasterComponent },
  { path: 'form-subtype', component: FormSubTypeComponent },
  { path: 'form-template', component: FormTemplateComponent },
  { path: 'proceeding-type', component: ProceedingTypeComponent },
  { path: 'proceeding', component: ProceedingComponent },
  { path: 'work-type', component: WorkTypeComponent },
  { path: 'work', component: WorkComponent },
  { path: 'court', component: CourtComponent },
  { path: 'court-complex', component: CourtComplexComponent},
];
