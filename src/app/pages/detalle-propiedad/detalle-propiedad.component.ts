import { Component, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadService } from '../../services/propiedad.service';
import { IPropiedad, IImagen, IFeedBackMessage, IFeedbackStatus, IUser, IRenta  } from '../../interfaces';
import { ImagenComponent } from '../../components/imagen/imagen.component';
import { ImagenModalComponent } from '../../components/imagen/imagen-modal/imagen-modal.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../components/modal/modal.component';
import { BtnInicioComponent } from '../../components/btn-inicio/btn-inicio.component';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule, NgForm} from '@angular/forms';
import { RentaService } from '../../services/renta.service';
import { FormPropiedadComponent } from "../../components/propiedad/form-propiedad/form-propiedad.component";
import { ImagenService } from '../../services/imagen.service';
import { UserService } from '../../services/user.service';
import { CalificacionPropiedadComponent } from "../../components/calificacion-propiedad/form-calificacion-propiedad/calificacion-propiedad.component";
import { CalificacionPropiedadCardComponent } from '../../components/calificacion-propiedad-card/calificacion-propiedad-card.component';
import { ComentarioPropiedadComponent} from '../../components/calificacion-propiedad/comentarios-propiedad/comentarios-propiedad';


@Component({
  selector: 'app-propiedad',
  standalone: true,


  imports: [
    ImagenComponent,
    ImagenModalComponent,
    CommonModule,
    BtnInicioComponent,
    ModalComponent,
    FormPropiedadComponent,
    ReactiveFormsModule,
    FormsModule,
    CalificacionPropiedadComponent,
    CalificacionPropiedadCardComponent,
    ComentarioPropiedadComponent],

  templateUrl: './detalle-propiedad.component.html',
  styleUrl: './detalle-propiedad.component.scss'
})
export class PropiedadDetalleComponent implements OnInit{
  rentaForm!: FormGroup;
  userId!: number;
  protected propiedadId: number;
  public editSuccess!: boolean;
  feedbackMessage: IFeedBackMessage = {type: IFeedbackStatus.default, message: ''};
  protected id: number | undefined;
  protected currentUserId: number = 0;
  user: IUser = {};

  listaImagenes: IImagen[] = [];
  propiedad: IPropiedad = {
    listaImagenes: this.listaImagenes
  };
  renta: IRenta = {
    estado: 'pendiente'
  }
  formSuccess: boolean = false;
  formFailure: boolean = false;
  errorMessage!: string
  private service = inject(PropiedadService);
  
imagenService = inject(ImagenService);
propiedadService = inject(PropiedadService);
userService = inject(UserService);
private rentaService = inject(RentaService);

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    this.propiedadId = parseInt(this.route.snapshot.paramMap.get('id') ?? '0', 10);
    let user = localStorage.getItem('auth_user');
    
    if(user) {
      this.currentUserId = JSON.parse(user)?.id;
    }
    
    try {
      this.service.getByIdSignal(this.propiedadId);
      effect(() => {
        this.propiedad = this.service.propiedad$();
        this.id = this.propiedad.user?.id;
        console.log(this.propiedad);
        console.log("due;o de propiedad:"+this.id);
      })
    } catch(error) {
      console.error("El id no está en un formato correcto o no existe: " + error);
    }
    

    console.log("CurrentUser: " + this.currentUserId, " id: " + this.id)

    const userId = this.id;
    

    //  if (userId) {
    //   this.userService.getByIdSignal(userId);
    //   effect(() => {
    //     this.user = this.userService.user$();
    //   })
    // } else {
    //   console.error('El ID no es un número o el usuario no existe');
    // }

    this.propiedadId = parseInt(this.route.snapshot.paramMap.get('id') ?? '0', 10);
    

    if(user) {
      this.userId = parseInt(JSON.parse(user).id);
    }

        try {
            this.service.getByIdSignal(this.propiedadId);
            effect(() => {
                this.propiedad = this.service.propiedad$();
                console.log(this.propiedad);
                this.id = this.propiedad.user?.id
            });
        } catch (error) {
            console.error("El id no está en un formato correcto o no existe: " + error);
        }
  }
  
  ngOnInit(): void {
    this.rentaForm = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
      estado: ['pendiente'],
      comentario: [''],
      user: [{
        id: this.userId
      }],
      propiedad: [{
        propiedadId: this.propiedadId
      }]
    }, { validators: this.dateRangeValidator });
}

dateRangeValidator(control: AbstractControl): ValidationErrors | null{
  const fechaInicio = new Date(control.get('fechaInicio')?.value).setHours(0, 0, 0, 0);
  const fechaFin = new Date(control.get('fechaFin')?.value).setHours(0, 0, 0, 0);
  const today = new Date().setHours(0, 0, 0, 0);

  if (fechaInicio && fechaFin && new Date(fechaFin) <= new Date(fechaInicio)) {
    return { dateRangeInvalid: true };
  }

  if (fechaInicio && fechaFin && fechaInicio < today || fechaFin < today) {
    return { dateNotAfterToday: true };
  }

  return null;
}

onSubmit(modal: any): void {
  if (this.rentaForm.valid) {
    this.renta = this.rentaForm.value;
    this.rentaService.saveRentaSignal(this.renta).subscribe({
      next: () => {
        this.formSuccess = true;
        setTimeout(() => {
          this.router.navigateByUrl('/app/rentas');
          modal.hide();
        }, 1000);
      },
      error: (error: any) => {
        this.formFailure = true;
        this.errorMessage = error.message;
      }
    });
  }

  
}

calificarPropiedad(modal: any) {
  modal.show();
}
showModal(modal: any) {
  modal.show()
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
