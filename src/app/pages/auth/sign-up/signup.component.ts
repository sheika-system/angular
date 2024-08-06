import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject, Input} from '@angular/core';
import { FormsModule, NgModel } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { IUbicacion, IUser } from '../../../interfaces';
import { TopbarComponent } from '../../../components/app-layout/elements/topbar/topbar.component';
import { UbicacionSelectorComponent } from '../../../components/ubicacion/ubicacion-selector/ubicacion-selector.component';
import { UbicacionService } from '../../../services/ubicacion.service';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { ModalComponent } from '../../../components/modal/modal.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, LoaderComponent, FormsModule, RouterLink, TopbarComponent, UbicacionSelectorComponent, ModalComponent],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SigUpComponent {
  public signUpError!: String;
  public validSignup!: boolean;
  service = inject(UbicacionService);
  @ViewChild('nombre') nameModel!: NgModel;
  @ViewChild('apellido') lastnameModel!: NgModel;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('password') passwordModel!: NgModel;
  @ViewChild('confirmPassword') confirmPasswordModel!: NgModel;

  ubicacionTest: IUbicacion = {
    direccion: "",
    latitud: 0,
    longitud: 0,
    provincia: { provinciaId: undefined , nombre: "" },
    canton: { cantonId: undefined, nombre: "" },
    distrito: { distritoId: undefined, nombre: "" }
  };

  @Input() confirmPassword: string = '';

  @Input() user: IUser = {
    nombre: '',
    apellido: '',
    ubicacion: this.ubicacionTest,
    photo: undefined,
    email: '',
    password: ''
  };

  imageSrc: string | ArrayBuffer | null = null;

  constructor(private router: Router, 
    private authService: AuthService,
  ) {}

  public handleSignup(event: Event) {
    event.preventDefault();

    if (this.user.password !== this.confirmPasswordModel.value) {
      this.confirmPasswordModel.control.setErrors({ 'passwordMismatch': true });
      return;
    }
    if (!this.nameModel.valid) {
      this.nameModel.control.markAsTouched();
    }
    if (!this.lastnameModel.valid) {
      this.lastnameModel.control.markAsTouched();
    }
    if (!this.emailModel.valid) {
      this.emailModel.control.markAsTouched();
    }
    if (!this.passwordModel.valid) {
      this.passwordModel.control.markAsTouched();
    }
    if (this.emailModel.valid && this.passwordModel.valid) {
      this.authService.signup(this.user).subscribe({
        next: () => {
          this.validSignup = true;
          setTimeout(() => {
            this.router.navigateByUrl('/login');
          }, 1000);
        },
        error: (err: any) => (this.signUpError = err.description)
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1];
        this.user.photo = base64String;
        this.imageSrc = reader.result;
      }

      reader.readAsDataURL(file);
    }
  }

  ngOnInit() {
    this.service.getProvincias();
    this.service.getCantones();
    this.service.getDistritos();
  }

  onUbicacionChange(params: IUbicacion) {
    this.ubicacionTest = params;
    console.log('Ubicación actualizada:', this.ubicacionTest);
    // Aquí puedes realizar acciones adicionales si es necesario
  }
}
