import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Login } from '../auth/components/login/login';
import { Register } from '../auth/components/register/register';
import { ForgotPassword } from '../auth/components/forgot-password/forgot-password';

@Component({
  selector: 'app-welcome',
  imports: [CommonModule,Login,Register,ForgotPassword],
  templateUrl: './welcome.html',
  styleUrl: './welcome.css',
  standalone: true
})
export class Welcome {
  activeBox: 'login' | 'register' | 'forgot' = 'login'; // default to login

  showLogin() {
    this.activeBox = 'login';
  }

  showRegister() {
    this.activeBox = 'register';
  }

  showForgot() {
    this.activeBox = 'forgot';
  }

}
