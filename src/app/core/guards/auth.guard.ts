import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { TokenService } from '@core/auth/services/token.service';
import { AppStateManager } from '@core/state/app-state-manager.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokenServive = inject(TokenService);
  const appStateManager = inject(AppStateManager);
  const isAuthenticated = tokenServive.hasToken();

  if (!isAuthenticated) {
    appStateManager.clearAll();
    router.navigate(['/auth/login']);
  }

  return isAuthenticated;
};
