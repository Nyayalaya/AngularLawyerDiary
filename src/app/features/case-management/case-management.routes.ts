import { Routes } from '@angular/router';

import { CaseManageComponent } from './components/case-manage/case-manage';

export const caseManagementRoutes: Routes = [
  { path: 'case-manage', component: CaseManageComponent },
  { path: '', redirectTo: 'case-manage', pathMatch: 'full' }
];
