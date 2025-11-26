import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from '../../shared/notification.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'], // corrected
})
export class Login {
  username = '';
  password = '';

  // EventEmitters to notify parent component
  @Output() registerClick = new EventEmitter<void>();
  @Output() forgotClick = new EventEmitter<void>();

  constructor(private router: Router, private notiservice:NotificationService) {}

  onLogin() {
    if(this.username!=this.password)
    {
      this.notiservice.warning('passwordMismatch');
    return;
    }
    console.log('Username:', this.username);
    console.log('Password:', this.password);
    this.router.navigate(['/dashboard']); // navigate to dashboard after login
    // TODO: call your AuthService here for real login
  }

  // Emit events for swapping boxes
  onRegisterClick() {
    this.registerClick.emit();
  }

  onForgotClick() {
    this.forgotClick.emit();
  }
}
