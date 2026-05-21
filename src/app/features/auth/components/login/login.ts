// src/app/features/auth/components/login/login.component.ts
import { Component, inject, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
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

  // ── Parent toggles (used on Welcome screen) ───────────────────────────────
  @Output() registerClick = new EventEmitter<void>();
  @Output() forgotClick = new EventEmitter<void>();

  /** When embedded inside Welcome page, render only the card area */
  @Input() embedded = false;

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
    // If hosted inside Welcome, toggle in-place. Otherwise navigate to route.
    if ((this.registerClick as any).observers?.length) {
      this.registerClick.emit();
      return;
    }
    this.router.navigate(['/register']);
  }

  onForgotClick(): void {
    // If hosted inside Welcome, toggle in-place. Otherwise navigate to route.
    if ((this.forgotClick as any).observers?.length) {
      this.forgotClick.emit();
      return;
    }
    this.router.navigate(['/forgot']);
  }

  // ── UI helper ─────────────────────────────────────────────────────────────
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}