import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { TokenService } from '@core/auth/services/token.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const tokenServive = inject(TokenService);
  const isAuthenticated = tokenServive.hasToken();

  if (!isAuthenticated) {
    router.navigate(['/auth/login']);
  }

  return isAuthenticated;
};
