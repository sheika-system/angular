import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const handleErrorsInterceptor: HttpInterceptorFn = (req, next) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  return next(req).pipe(
    catchError((error: any): Observable<any> => {
      if (error.status === 403 && error.error?.description === 'The JWT signature is invalid') {
        authService.logout();
        window.location.assign('/token-expired');
        return of({ status: false });
      }
      if (error.status === 403 && error.error?.description === 'The JWT token has expired') {
        authService.logout();
        window.location.assign('/token-expired');
        return of({ status: false });
      }
      if ((error.status === 401 || error.status === 403) && !req.url.includes('auth')) {
        authService.logout();
        router.navigateByUrl('/home');
        return of({ status: false });
      }
      if (error.status === 422) {
        throw error.error;
      }
      if (error.status === 404) {
        throw { status: false };
      }
      return of({ status: false });
    })
  );
};
