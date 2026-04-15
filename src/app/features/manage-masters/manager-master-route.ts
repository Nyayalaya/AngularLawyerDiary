import { Routes } from '@angular/router';
import { MasterCategory } from './master-category/master-category';
import { FormBuilderPage } from '../dynamic-forms/pages/form-builder/form-builder';
import { FormRender } from '../dynamic-forms/pages/form-render/form-render';



export const ManageMastersRoutes: Routes = [
  { 
    path: 'master-category', component: MasterCategory 
  },
  {
    path: 'form-builder',
    component: FormBuilderPage
  },

  // ✅ runtime page
  {
    path: 'form/:id',
    component: FormRender
  }

];
