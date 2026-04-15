import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css',
})
export class ForgotPassword {
  email = '';

  @Output() loginClick = new EventEmitter<void>();

  onSubmit() {
    if (!this.email) {
      alert('Please enter your email!');
      return;
    }
    console.log('Forgot password for:', this.email);
    alert('Password reset link sent to your email!');
    this.loginClick.emit(); // go back to login after submission
  }

  goToLogin() {
    this.loginClick.emit();
  }

}
