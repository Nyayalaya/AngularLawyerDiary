import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../core';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  constructor(private router: Router) { }

  registerData: RegisterRequest = {
    firstName: '',
    lastName: '',
    enrollment: '',
    email: '',
    password: '',
    confirmPassword: ''
  };

  @Output() loginClick = new EventEmitter<void>();

  onRegister() {
    if (this.registerData.password !== this.registerData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    console.log('Registration Data:', this.registerData);

    // TODO: call AuthService.register(this.registerData)
    alert('Registration successful!');

    this.loginClick.emit(); // go back to login after register
  }

  goToLogin() {
    this.loginClick.emit();
  }

}
