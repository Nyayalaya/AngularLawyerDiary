import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder  } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationService } from '../../shared/notification.service';
import { AuthService } from '../../core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'], // corrected
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  returnUrl = '';

  // EventEmitters to notify parent component
  @Output() registerClick = new EventEmitter<void>();
  @Output() forgotClick = new EventEmitter<void>();

  constructor(
    private router: Router,
    private notiservice: NotificationService,
    private authService: AuthService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  get f() {
    return this.loginForm.controls;
  }

  onLogin() {
    this.submitted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    const credentials = {
      email: this.f['email'].value,
      password: this.f['password'].value
    };

    this.authService.login(credentials).subscribe({
      next: (response) => {
        console.log('Login successful', response);
        this.router.navigate([this.returnUrl]);
      },
      error: (error) => {
        this.notiservice.warning('passwordMismatch', error.message);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }


  // Emit events for swapping boxes
  onRegisterClick() {
    this.registerClick.emit();
  }

  onForgotClick() {
    this.forgotClick.emit();
  }
}
