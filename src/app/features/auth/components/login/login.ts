// src/app/features/auth/components/login/login.component.ts
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule }                          from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router }                                from '@angular/router';
import { Store }                                 from '@ngrx/store';
import { Subject }                               from 'rxjs';
import { takeUntil }                             from 'rxjs/operators';

import { loginRequest }    from '../../store/auth.actions';
import {
  selectAuthLoading,
  selectAuthError,
  selectIsLoggedIn,
}                          from '../../store/auth.selectors';
import { LoginRequest }    from '../../models/login-request.model';

@Component({
  selector:    'app-login',
  standalone:  true,
  imports:     [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls:   ['./login.css'],
})
export class Login implements OnInit, OnDestroy {

  // ── DI ──────────────────────────────────────────────────────────────────
  private fb      = inject(FormBuilder);
  private store   = inject(Store);
  private router  = inject(Router);
  private destroy$ = new Subject<void>();

  // ── Store streams ────────────────────────────────────────────────────────
  loading$    = this.store.select(selectAuthLoading);
  error$      = this.store.select(selectAuthError);
  isLoggedIn$ = this.store.select(selectIsLoggedIn);

  // ── Local UI state ───────────────────────────────────────────────────────
  submitted    = false;
  showPassword = false;

  // ── Form ─────────────────────────────────────────────────────────────────
  // Matches LoginRequest model exactly: { email, password, rememberMe }
  loginForm = this.fb.group({
    email:      ['', [Validators.required, Validators.email]],
    password:   ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });

  // ── Lifecycle ─────────────────────────────────────────────────────────────
  ngOnInit(): void {
    // If already logged in (rehydrated from localStorage), skip to dashboard
    this.isLoggedIn$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isLoggedIn => {
        if (isLoggedIn) this.router.navigate(['/dashboard']);
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ── Convenience getter — used in template as f['email'] ──────────────────
  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  onLogin(): void {
    this.submitted = true;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const { email, password, rememberMe } = this.loginForm.getRawValue();

    const credentials: LoginRequest = {
      email:      email!,
      password:   password!,
      rememberMe: rememberMe ?? false,
    };

    // Single dispatch — Effects, Reducer, TokenService, Guards take over
    this.store.dispatch(loginRequest({ credentials }));
  }

  // ── Navigation helpers ────────────────────────────────────────────────────
  onRegisterClick(): void {
    this.router.navigate(['/register']);
  }

  onForgotClick(): void {
    this.router.navigate(['/forgot']);
  }

  // ── UI helper ─────────────────────────────────────────────────────────────
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}