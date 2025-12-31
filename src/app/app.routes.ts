import { Routes } from '@angular/router';
import { Register } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { Layout } from './components/layout/layout/layout';
import { Splash } from './components/splash/splash';
import { Welcome } from './components/welcome/welcome';
import { ForgotPassword } from './components/forgot-password/forgot-password';
import { masterRoutes } from './components/master/master.routes';
import { AuthGuard } from './core';

export const routes: Routes = [
  { path: '', component: Splash },      // default splash page
  { path: 'default', component: Welcome }, // main application startup page
  {
    path: '', component: Layout, children: [
      { path: 'dashboard', component: Dashboard, canActivate: [AuthGuard] },
      {path: 'master',children: masterRoutes, canActivate: [AuthGuard]}

    ]
  },

  { path: 'register', component: Register },
  { path: 'forgot', component: ForgotPassword },
  { path: '**', redirectTo: '' }
];
