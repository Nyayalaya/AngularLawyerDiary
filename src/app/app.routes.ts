import { Routes } from '@angular/router';
import { Register } from './features/auth/components/register/register';
import { Dashboard } from './features/dashboard/dashboard';
import { Layout } from './features/layout/layout/layout';
import { Splash } from './features/splash/splash';
import { Welcome } from './features/welcome/welcome';
import { ForgotPassword } from './features/auth/components/forgot-password/forgot-password';
import { masterRoutes } from './features/masters/master.routes';
import { Profile } from './features/profile/profile';
import { authGuard } from './core';
import { ManageMastersRoutes } from './features/manage-masters/manager-master-route';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  { path: '', component: Splash },      // default splash page
  { path: 'default', component: Welcome }, // main application startup page
  {
    path: '', component: Layout, children: [
      { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
      { path:  'master',children: masterRoutes, canActivate: [authGuard] },
      { path:  'manage-master',children: ManageMastersRoutes, canActivate: [authGuard]},
      { path: 'profile',component: Profile, canActivate: [authGuard]}
    ]
  },

  { path: 'register', component: Register },
  { path: 'forgot', component: ForgotPassword },
  {
  path: 'forms',
  loadChildren: () =>
    import('../app/features/dynamic-forms/dynamic-forms.routes')
      .then(m => m.routes)
},
  { path: '**', redirectTo: '' }
];
