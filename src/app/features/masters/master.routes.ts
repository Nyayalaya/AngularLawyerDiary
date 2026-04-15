import { Routes } from '@angular/router';
import { CourtTypeComponent } from './components/court-type/court-type';
import { CaseCategoryComponent } from './components/case-category/case-category';
import { StateView } from './components/state-view/state-view';
import { CaseStageComponent } from './components/case-stage/case-stage';
import { CourtLevelComponent } from './components/court-level/court-level';
import { CadreComponent } from './components/cadre/cadre';
import { CourtDistrictComponent } from './components/court-district/court-district';


export const masterRoutes: Routes = [
  { path: 'state', component:  StateView },
  { path: 'court-level', component: CourtLevelComponent },
  { path: 'court-type', component:  CourtTypeComponent },
  { path: 'case-category', component: CaseCategoryComponent },
  { path: 'case-stage', component: CaseStageComponent },
  { path: 'cadre', component: CadreComponent },
  { path: 'court-district', component: CourtDistrictComponent }
];
