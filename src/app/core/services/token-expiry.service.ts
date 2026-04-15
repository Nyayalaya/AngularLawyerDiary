// src/app/core/services/token-expiry.service.ts

import { Injectable, inject, NgZone, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { TokenService } from './token.service';
import { logout, sessionExpiring } from '../../features/auth/store/auth.actions';

const CHECK_INTERVAL_MS = 60_000;            // every 1 min
const WARN_BEFORE_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes

@Injectable({ providedIn: 'root' })
export class TokenExpiryService implements OnDestroy {

  private store = inject(Store);
  private tokenSvc = inject(TokenService);
  private ngZone = inject(NgZone);

  private intervalId: any = null;
  private warnFired = false;

  /* =====================================================
     START WATCHING
  ===================================================== */
  startWatching(): void {

    this.stopWatching();
    this.warnFired = false;

    this.ngZone.runOutsideAngular(() => {
      this.intervalId = setInterval(() => this.check(), CHECK_INTERVAL_MS);
    });

    this.check(); // immediate run

    document.addEventListener('visibilitychange', this.onVisibilityChange);
    window.addEventListener('storage', this.onStorageChange);
  }

  /* =====================================================
     STOP WATCHING
  ===================================================== */
  stopWatching(): void {

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    window.removeEventListener('storage', this.onStorageChange);

    this.warnFired = false;
  }

  ngOnDestroy(): void {
    this.stopWatching();
  }

  /* =====================================================
     CHECK EXPIRY
  ===================================================== */
  private check(): void {

    const expiresAt = this.tokenSvc.getExpiry(); // ✅ FIXED

    if (!expiresAt || isNaN(expiresAt)) return;

    const msRemaining = expiresAt - Date.now();

    /* 🔴 EXPIRED */
    if (msRemaining <= 0) {
      this.stopWatching();

      this.ngZone.run(() => {
        this.store.dispatch(logout());
      });

      return;
    }

    /* 🟡 EXPIRING SOON */
    if (msRemaining <= WARN_BEFORE_EXPIRY_MS && !this.warnFired) {

      this.warnFired = true;

      this.ngZone.run(() => {
        this.store.dispatch(sessionExpiring());
      });
    }
  }

  /* =====================================================
     TAB VISIBILITY
  ===================================================== */
  private onVisibilityChange = (): void => {
    if (document.visibilityState === 'visible') {
      this.check();
    }
  };

  /* =====================================================
     CROSS TAB LOGOUT
  ===================================================== */
  private onStorageChange = (event: StorageEvent): void => {

    if (event.key === 'ACCESS_TOKEN' && event.newValue === null) { // ✅ FIXED

      this.ngZone.run(() => {
        this.store.dispatch(logout());
      });
    }
  };
}
