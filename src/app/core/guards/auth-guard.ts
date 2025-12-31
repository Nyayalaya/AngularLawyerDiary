// core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services'; // your auth service

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) { }

  canActivate(): boolean {
    if (this.auth.isAuthenticated) {
      return true; // user is authenticated
    } else {
      this.router.navigate(['/']); // redirect to login/splash page
      return false;
    }
  }
}
