import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LoaderComponent } from '../../components/loader/loader.component';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TopbarComponent } from '../../components/app-layout/elements/topbar/topbar.component';
import { UbicacionSelectorComponent } from '../../components/ubicacion/ubicacion-selector/ubicacion-selector.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { ForgotPasswordService } from '../../services/forgot-password.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, LoaderComponent, FormsModule, RouterLink, TopbarComponent, UbicacionSelectorComponent, ModalComponent],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss'
})
export class ForgotPasswordComponent {
  public requestError!: String;
  public validRequest!: boolean;
  public sendEmail = { email: '' };

  constructor(private forgotPasswordService: ForgotPasswordService) {}

  onSubmit(form: NgForm) {
    if (form.valid) {
      this.forgotPasswordService.sendForgotPasswordEmail(this.sendEmail.email).subscribe({
        next: () => {
          this.validRequest = true;
          this.requestError = '';
        },
        error: (err: any) => {
          this.requestError = err;
          this.validRequest = false;
        }
      });
    }
  }
}
