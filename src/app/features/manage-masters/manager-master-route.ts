import { Routes } from '@angular/router';
import { MasterCategory } from './master-category/master-category';
import { FormBuilderPage } from '../dynamic-forms/pages/form-builder/form-builder';
import { FormRender } from '../dynamic-forms/pages/form-render/form-render';
import { DraftingComponent } from './drafting/drafting';
import { CourtComponent } from '../masters/components/court/court';
import { CourtComplexComponent } from '../masters/components/court-complex/court-complex';

import { ProceedingWorkComponent } from './proceeding-work/proceeding-work';

export const ManageMastersRoutes: Routes = [
  { 
    path: 'master-category', component: MasterCategory 
  },
  {
    path: 'form-builder',
    component: FormBuilderPage
  },
  {
    path: 'drafting',
    component: DraftingComponent
  },
  {
    path: 'court',
    component: CourtComponent
  },
  
  {
    path: 'proceeding-work',
    component: ProceedingWorkComponent
  },

  // ✅ runtime page
  {
    path: 'form/:id',
    component: FormRender
  }

];
