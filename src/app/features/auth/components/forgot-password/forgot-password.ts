import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  /** When embedded inside Welcome page, render without full-page background */
  @Input() embedded = false;
  @Output() loginClick = new EventEmitter<void>();

  email = '';
  private router = inject(Router);

  onSubmit() {
    if (!this.email) {
      alert('Please enter your email!');
      return;
    }
    console.log('Forgot password for:', this.email);
    alert('Password reset link sent to your email!');
    this.goToLogin();
  }

  goToLogin() {
    // If hosted inside Welcome, toggle in-place. Otherwise navigate to route.
    if ((this.loginClick as any).observers?.length) {
      this.loginClick.emit();
      return;
    }
    this.router.navigate(['/default']);
  }

}
