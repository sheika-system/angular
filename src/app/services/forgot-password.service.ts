import { Injectable, signal } from '@angular/core';
import { IResetPasswordToken, IResponse, IUser } from '../interfaces';
import { BaseService } from './base-service';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService extends BaseService<IResetPasswordToken> {
  protected override source: string = 'auth/forgot-password';

  sendForgotPasswordEmail(email: string): Observable<any> {
    const user: IUser = { email };
    return this.addByEmail(user).pipe(
      catchError(error => {
        console.error('Error sending forgot password email', error);
        return throwError(error);
      })
    );
  }
}
