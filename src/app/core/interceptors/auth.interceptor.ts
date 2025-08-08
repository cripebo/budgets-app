import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TokenService } from '@core/auth/services/token.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);

  const authToken = tokenService.getToken();
  let clonedRequest = req;

  if (authToken) {
    clonedRequest = req.clone({
      setHeaders: {
        Authorization: authToken,
      },
    });
  }

  return next(clonedRequest);
};
