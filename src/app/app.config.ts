import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection
} from '@angular/core';

import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';

import { provideRouter } from '@angular/router';
import { routes } from './app.routes';

import { AuthInterceptor } from './core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),

    provideRouter(routes),

    // ✅ HttpClient + class-based interceptors
    provideHttpClient(withInterceptorsFromDi()),

    // ✅ Register interceptor in DI
    {
      provide: AuthInterceptor,
      useClass: AuthInterceptor
    }
  ]
};
