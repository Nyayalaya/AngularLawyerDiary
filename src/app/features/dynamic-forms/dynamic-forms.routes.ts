import { Routes } from "@angular/router";
import { FormRender } from "./pages/form-render/form-render";

export const routes: Routes = [
  {
    path: ':id',
    component: FormRender
  },
  {
  path: 'builder',
  loadComponent: () =>
    import('./pages/form-builder/form-builder')
      .then(m => m.FormBuilderPage)
}
];
