import { Component, inject, Input, ViewChild, } from '@angular/core';
import { IFeedBackMessage, IFeedbackStatus, IUbicacion, IUser } from '../../../interfaces';
import { FormsModule, NgForm, NgModel } from '@angular/forms';
import { UbicacionSelectorComponent } from '../../ubicacion/ubicacion-selector/ubicacion-selector.component';
import { UbicacionService } from '../../../services/ubicacion.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../services/user.service';
import {CalificacionUsuarioCardComponent} from '../../calificacion-usuario-card/calificacion-usuario-card.component';
import { catchError, tap, throwError } from 'rxjs';

@Component({
  selector: 'app-perfil-form',
  standalone: true,
  imports: [UbicacionSelectorComponent, FormsModule, CommonModule],
  templateUrl: './perfil-form.component.html',
  styleUrl: './perfil-form.component.scss'
})
export class PerfilFormComponent {
  public editSuccess!: boolean;
  public profileEditError!: String;
  public validProfileEdit!: boolean;
  ubicacionService = inject(UbicacionService);
  userService = inject(UserService);
  feedbackMessage: IFeedBackMessage = {type: IFeedbackStatus.default, message: ''};

  @ViewChild('nombre') nameModel!: NgModel;
  @ViewChild('apellido') apelllidoModel!: NgModel;
  @ViewChild('email') emailModel!: NgModel;
  @ViewChild('id') idModel!: NgModel;

  ubicacion: IUbicacion = {
    direccion: "",
    latitud: 0,
    longitud: 0,
    provincia: { provinciaId: undefined , nombre: "" },
    canton: { cantonId: undefined, nombre: "" },
    distrito: { distritoId: undefined, nombre: "" }
  };
  
  @Input() user: IUser = {
    id: 0,
    photo: undefined,
    nombre: '',
    apellido: '',
    email: '',
    ubicacion: this.ubicacion
  }

  private sanitizeUser(user: IUser): any {
    const { authorities, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  handleUpdate(form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(controlName => {
        form.controls[controlName].markAsTouched();
      });
      return;
    } else {
      const sanitizedUser = this.sanitizeUser(this.user);
      this.userService.updateUserSignal(sanitizedUser).subscribe({
        next: () => {
          this.editSuccess = true;
          setTimeout(function(){
            location.reload();
          }, 1000);
        },
        error: (error: any) => {
          this.feedbackMessage.type = IFeedbackStatus.error;
          this.feedbackMessage.message = error.message;
          console.log(this.user);
          console.log(this.ubicacion);
        }
      });       
    }
  }

  ngOnInit() {
    this.ubicacionService.getProvincias();
    this.ubicacionService.getCantones();
    this.ubicacionService.getDistritos();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1];
        this.user.photo = base64String;
      }

      reader.readAsDataURL(file);
    }
  }

  onUbicacionChange(params: IUbicacion) {
    this.ubicacion = params;
    this.user.ubicacion = this.ubicacion;
    console.log('Ubicación actualizada:', this.ubicacion);
    // Aquí puedes realizar acciones adicionales si es necesario
  }
}
