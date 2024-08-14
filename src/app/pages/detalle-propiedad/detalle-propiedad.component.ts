import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropiedadService } from '../../services/propiedad.service';
import { IPropiedad, IImagen, IFeedBackMessage, IFeedbackStatus, IUser } from '../../interfaces';
import { ImagenComponent } from '../../components/imagen/imagen.component';
import { ImagenModalComponent } from '../../components/imagen/imagen-modal/imagen-modal.component';
import { CommonModule } from '@angular/common';
import { BtnInicioComponent } from '../../components/btn-inicio/btn-inicio.component';
import { ModalComponent } from "../../components/modal/modal.component";
import { FormPropiedadComponent } from "../../components/propiedad/form-propiedad/form-propiedad.component";
import { ImagenService } from '../../services/imagen.service';
import { FormsModule, NgForm } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-propiedad',
  standalone: true,
  imports: [ImagenComponent, ImagenModalComponent, CommonModule, BtnInicioComponent, ModalComponent, FormPropiedadComponent, FormsModule],
  templateUrl: './detalle-propiedad.component.html',
  styleUrl: './detalle-propiedad.component.scss'
})
export class PropiedadDetalleComponent{
  protected propiedadId: number;
  public editSuccess!: boolean;
  feedbackMessage: IFeedBackMessage = {type: IFeedbackStatus.default, message: ''};
  currentUserId: number | undefined;
  protected id: string | null = '';
  user: IUser = {};
  listaImagenes: IImagen[] = [];
  protected propiedad: IPropiedad = {
    listaImagenes: this.listaImagenes
  };
  private service = inject(PropiedadService);
  imagenService = inject(ImagenService);
  propiedadService = inject(PropiedadService);
  userService = inject(UserService);

  
  constructor(private route: ActivatedRoute) {
    this.cargarDatosUsuario();  // Cargar datos del usuario actual
    this.propiedadId = parseInt(this.route.snapshot.paramMap.get('id') ?? '0', 10);

        try {
            this.service.getByIdSignal(this.propiedadId);
            effect(() => {
                this.propiedad = this.service.propiedad$();
                console.log(this.propiedad);
            });
        } catch (error) {
            console.error("El id no está en un formato correcto o no existe: " + error);
        }
  }

  async cargarDatosUsuario(): Promise<void> {
    try {
      // Aquí puedes asignar el ID del usuario actual
      const user = await this.userService.user$(); // Método para obtener el usuario logeado actual
      this.currentUserId = user?.id;
  } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
  }
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
      const sanitizedUser = this.sanitizeUser(this.propiedad);
      this.propiedad.user = sanitizedUser;
      this.propiedadService.updatePropiedadSignal(this.propiedad).subscribe({
        next: () => {
          this.editSuccess = true;
          setTimeout(function(){
            location.reload();
          }, 1000);
        },
        error: (error: any) => {
          this.feedbackMessage.type = IFeedbackStatus.error;
          this.feedbackMessage.message = error.message;
          console.log(this.propiedad);
        }
      });       
    }
  }


  showDetail(propiedad: IPropiedad, modal: any) {
    propiedad = this.propiedad;
    modal.show();
  }

  showImg(imagenes: IImagen[], modal: any) {
    imagenes = this.listaImagenes;
    modal.show();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if(file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1];
        this.propiedad.listaImagenes = base64String;
      }

      reader.readAsDataURL(file);
    }
  }

  onImagenesRegistrar(params: IImagen[]) {
    console.log("onImagenesRegistrar", params)
    
    this.propiedad.listaImagenes = params;
  }

}
