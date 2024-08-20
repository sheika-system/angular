import { Component, effect, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadService } from '../../services/propiedad.service';
import { IPropiedad, IImagen, IFeedBackMessage, IFeedbackStatus, IUser, IRenta, IRecorrido3D } from '../../interfaces';
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
import { Recorrido3dFormComponent } from "../../components/recorrido3d/recorrido3d-form/recorrido3d-form.component";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Recorrido3dVisorComponent } from "../../components/recorrido3d/recorrido3d-visor/recorrido3d-visor.component";
import { Recorrido3dService } from '../../services/recorrido3d.service';


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
    ComentarioPropiedadComponent,
    Recorrido3dFormComponent, 
    Recorrido3dVisorComponent],

  templateUrl: './detalle-propiedad.component.html',
  styleUrl: './detalle-propiedad.component.scss',
  animations: [
    trigger('slideInOut', [
      state('true', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden'
      })),
      state('false', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden',
      })),
      transition('false <=> true', animate('300ms ease-in-out'))
    ])
  ]
})
export class PropiedadDetalleComponent implements OnInit{
  @ViewChild('recorrido3DForm') recorrido3DFormElement!: ElementRef;
  @ViewChild('recorrido3DVisor') recorrido3DVisorElement!: ElementRef;
  rentaForm!: FormGroup;
  userId!: number;
  protected propiedadId: number;
  recorrido3d: IRecorrido3D | null = null;
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
  verRecorrido3DForm = false;
  verVisorRecorrido3D = false;
  verRecorrido3dFormInvalid = true;
  verRecorrido3dInvalid = true;
  panoramaReady = false;
  recorrido3dExiste: boolean = false;
  esPropietario: boolean = false;
  recorrido3dService = inject(Recorrido3dService)
  imagenService = inject(ImagenService);
  propiedadService = inject(PropiedadService);
  userService = inject(UserService);
  private rentaService = inject(RentaService);

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    this.propiedadId = parseInt(this.route.snapshot.paramMap.get('id') ?? '0', 10);
    this.loadCurrentUser();
    let user = localStorage.getItem('auth_user');
   
    // if(user) {
    //   this.currentUserId = JSON.parse(user)?.id;
    // }
    
    // try {
    //   this.service.getByIdSignal(this.propiedadId);
    //   effect(() => {
    //     this.propiedad = this.service.propiedad$();
    //     this.id = this.propiedad.user?.id;
        
    //   })
    // } catch(error) {
    //   console.error("El id no está en un formato correcto o no existe: " + error);
    // }
    
    effect(() => {
      const propiedadSignal = this.service.propiedad$;
      if (propiedadSignal) {
        this.propiedad = propiedadSignal();
        this.checkEsPropietario();
        this.id = this.propiedad.user?.id;
        if (this.propiedadId) {
          this.loadRecorrido3d();
        }
      }
    });
    effect(() => {
      const recorrido = this.recorrido3dService.recorrido3dRegistrado$();
      this.recorrido3d = recorrido;
      this.recorrido3dExiste = !!recorrido && !!recorrido.recorrido3dId;
      this.updateButtonStates();
    });

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
    if (this.propiedadId !== null) {
      this.service.getByIdSignal(this.propiedadId);
    }

}

private loadCurrentUser(): void {
  const user = localStorage.getItem('auth_user');
  if (user) {
    this.currentUserId = JSON.parse(user)?.id;
    this.checkEsPropietario();
  }
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
    
    
    this.propiedad.listaImagenes = params;
  }

  /// logica recorrido 3d///////////////////////////////////////////////////////

  private checkEsPropietario(): void{
    if (this.currentUserId !== null && this.propiedad) {
      const nuevoEsPropietario = this.currentUserId === this.propiedad.user?.id;
      if (this.esPropietario !== nuevoEsPropietario) {
        this.esPropietario = nuevoEsPropietario;
      }
    }
  }

  private updateButtonStates(): void {
    this.verRecorrido3dFormInvalid = this.esPropietario && this.recorrido3dExiste;
    this.verRecorrido3dInvalid = !this.recorrido3dExiste;
    
    if (this.esPropietario && !this.recorrido3dExiste) {
      this.verRecorrido3DForm = true;
    } else {
      this.verRecorrido3DForm = false;
    }
  }
  
  toggleRecorrido3DForm(): void {
    if (!this.verRecorrido3dFormInvalid) {
      this.verVisorRecorrido3D = false;
      this.verRecorrido3DForm = !this.verRecorrido3DForm;
      if (this.verRecorrido3DForm) {
        setTimeout(() => this.scrollToElement(this.recorrido3DFormElement), 300);
      }
    }
  }
  toggleVisorRecorrido3D(): void {
    if (!this.verRecorrido3dInvalid) {
      this.verRecorrido3DForm = false;
      this.verVisorRecorrido3D = !this.verVisorRecorrido3D;
      if (this.verVisorRecorrido3D) {
        setTimeout(() => this.scrollToElement(this.recorrido3DVisorElement), 300);
      }
    }
  }

  private scrollToElement(elementRef: ElementRef): void {
    if (elementRef && elementRef.nativeElement) {
      elementRef.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  loadRecorrido3d(): void {
    if (this.propiedadId) {
      this.recorrido3dService.getByIdSignal(this.propiedadId);
    }
  }

  mostrarPanorama(panoramaReady: boolean){
    this.panoramaReady = panoramaReady
  }

  mostrarRecorrido3dCreado(recorrido3d: IRecorrido3D) {
    if (recorrido3d && recorrido3d.recorrido3dId) {
      this.recorrido3d = recorrido3d;
      this.recorrido3dService.setRecorrido3d(recorrido3d); // Asegúrate de que este método exista en tu servicio
      this.verVisorRecorrido3D = true;
      if (this.verVisorRecorrido3D) {
        setTimeout(() => this.scrollToElement(this.recorrido3DVisorElement), 300);
      }
      // Asegúrate de que el estado se actualice completamente antes de mostrar el visor
      setTimeout(() => {
        this.updateButtonStates();
      }, 0);
    } else {
      console.error('Recorrido3D creado no válido:', recorrido3d);
    }
  }

  manejarEliminacionRecorrido3D() {
    this.recorrido3d = null;
    this.verVisorRecorrido3D = false;
    this.recorrido3dService.clearRecorrido3d(); // Asegúrate de que este método exista en tu servicio
    this.updateButtonStates();
  }





}
