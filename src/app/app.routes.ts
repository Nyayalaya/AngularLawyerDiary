import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Sidebar } from './components/sidebar/sidebar/sidebar';
import { Dashboard } from './components/dashboard/dashboard';
import { Header } from './components/header/header/header';
import { Footer } from './components/footer/footer/footer';
import { Layout } from './components/layout/layout/layout';
import { Splash } from './components/splash/splash';
import { Welcome } from './components/welcome/welcome';
import { ForgotPassword } from './components/forgot-password/forgot-password';

export const routes: Routes = [
  { path: '', component: Splash },      // default splash page
  { path: 'default', component: Welcome }, // main application startup page
  {
    path: '', component: Layout, children: [
      { path: 'dashboard', component: Dashboard },

    ]
  },

  { path: 'register', component: Register },
  { path: 'forgot', component: ForgotPassword },
  { path: '**', redirectTo: '' }
];
