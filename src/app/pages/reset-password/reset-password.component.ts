import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderComponent } from '../../components/loader/loader.component';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TopbarComponent } from '../../components/app-layout/elements/topbar/topbar.component';
import { UbicacionSelectorComponent } from '../../components/ubicacion/ubicacion-selector/ubicacion-selector.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ResetPasswordService } from '../../services/reset-password.service';
import { IResetPasswordRequest, IUser } from '../../interfaces';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, LoaderComponent, FormsModule, RouterLink, TopbarComponent, UbicacionSelectorComponent, ModalComponent],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {
  public requestError!: boolean;
  public validRequest!: boolean;
  public sendForm: { token: string; newPassword: string;} = {
    token: '',
    newPassword: ''
  };

  constructor(private resetPasswordService: ResetPasswordService, public router: Router) {}

  onSubmit(form: NgForm) {
    if (form) {
      if(this.sendForm.token !== "" && this.sendForm.newPassword !== "") {
        const request: IResetPasswordRequest = {
          newPassword: this.sendForm.newPassword
        };
        this.resetPasswordService.resetPassword(this.sendForm.token, request).subscribe({
          next: () => {
          },
          error: (err: any) => {
            console.error('Error in reset password component:', err);
            this.requestError = true;
            this.validRequest = false;
          }
        });
        this.validRequest = true;
        this.requestError = false;
        setTimeout(() => {
          this.router.navigateByUrl('/login')
        }, 1000);
      } else {
        this.requestError = true;
      }
    }
  }
}
