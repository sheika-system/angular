import { Injectable, signal } from '@angular/core';
import { IResetPasswordRequest, IResetPasswordToken, IUser } from '../interfaces';
import { BaseService } from './base-service';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService extends BaseService<IResetPasswordToken> {
  protected override source: string = 'auth/reset-password';
  private passwordResetSignal = signal<IResetPasswordRequest[]>([]);

  resetPassword(token: string, request: IResetPasswordRequest): Observable<any> {
    return this.editByToken(token, request).pipe(
      tap((response: any) => {
        const updatedPassword = this.passwordResetSignal().map(u => u.newPassword === request.newPassword ? response : u);
        this.passwordResetSignal.set(updatedPassword);
        console.log('Password reset successful:', response);
      }),
      catchError(error => {
        console.error('Error resetting password', error);
        return throwError(error);
      })
    );
  }
}
