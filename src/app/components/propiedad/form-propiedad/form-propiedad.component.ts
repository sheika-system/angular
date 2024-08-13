import { CommonModule } from '@angular/common';
import { Component, inject, Input, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { UbicacionService } from '../../../services/ubicacion.service';
import { AmenidadService } from '../../../services/amenidad.service';
import { TipoPropiedadService } from '../../../services/tipo-propiedad.service';
import { ImagenService } from '../../../services/imagen.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { IUser, IUbicacion, IAmenidad, ITipoPropiedad, ICurrency, IPropiedad, IImagen, IFeedbackStatus, IFeedBackMessage } from '../../../interfaces';
import { PropiedadService } from '../../../services/propiedad.service';
import { UserService } from '../../../services/user.service';
import { AmenidadComponent } from "../../amenidad/amenidad.component";
import { TipoPropiedadComponent } from "../../tipo-propiedad/tipo-propiedad.component";
import { ImagenComponent } from "../../imagen/imagen.component";
import { UbicacionSelectorComponent } from "../../ubicacion/ubicacion-selector/ubicacion-selector.component";
import { UbicacionComponent } from '../../../pages/ubicacion/ubicacion.component';
import { TopbarComponent } from '../../app-layout/elements/topbar/topbar.component';
import { BtnInicioComponent } from '../../btn-inicio/btn-inicio.component';
import { LoaderComponent } from '../../loader/loader.component';
import { MapComponent } from '../../map/map.component';
import { UbicacionFormComponent } from '../../ubicacion/ubicacion-form/ubicacion-form.component';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-form-propiedad',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TopbarComponent,
    LoaderComponent,
    UbicacionSelectorComponent,
    UbicacionComponent,
    AmenidadComponent,
    TipoPropiedadComponent,
    ImagenComponent,
    UbicacionFormComponent,
    MapComponent,
    BtnInicioComponent
],
  templateUrl: './form-propiedad.component.html',
  styleUrl: './form-propiedad.component.scss'
})
export class FormPropiedadComponent {
  service = inject(UbicacionService);
  amenidadService = inject(AmenidadService);
  tipoPropService = inject(TipoPropiedadService);
  imagenService = inject(ImagenService);
  userService = inject(UserService)


  public propiedadList: MatTableDataSource<IPropiedad> = new MatTableDataSource<IPropiedad>([]);

  public editSuccess!: boolean;
  public profileEditError!: String;
  public validProfileEdit!: boolean;
  ubicacionService = inject(UbicacionService);
  feedbackMessage: IFeedBackMessage = {type: IFeedbackStatus.default, message: ''};
  monedaInvalid = false;
  monedaTouched = false;

  currentUserId: number | undefined;
  user: IUser = {};
  id: number | undefined;

  ubicacion: IUbicacion = {
    ubicacionId: 0,
    direccion: "",
    latitud: 0,
    longitud: 0,
    provincia: { provinciaId: undefined , nombre: "" },
    canton: { cantonId: undefined, nombre: "" },
    distrito: { distritoId: undefined, nombre: "" }
  };

  listaAmenidades: IAmenidad[] = [{
    amenidadId: 0,
    nombre: ''
  }]

  tipoPropiedad: ITipoPropiedad = {
    tipoPropiedadId: 0,
    nombre: ''
  }
  currency: ICurrency = {
    value: '',
    viewValue: ''
  }

  currencies: ICurrency[] = [
    { value: 'USD', viewValue: 'Dólar Estadounidense (USD)' },
    { value: 'CRC', viewValue: 'Colón Costarricense (CRC)' }
  ];

  @Input() propiedad: IPropiedad = {
    nombre: '',
    descripcion: '',
    tipoPropiedad: this.tipoPropiedad,
    moneda: this.currency.value,
    precio: 0,
    ubicacion: this.ubicacion,
    amenidades: this.listaAmenidades,
    annioConstruccion: 0,
    cuartosCant: 0,
    banniosCant: 0,
    metrosCuadrados: 0,
    disponibilidad: true,
    listaImagenes: [],
    user: undefined
  };
  
  constructor(private propiedadService: PropiedadService, private route: ActivatedRoute, public router: Router) {
    const user = localStorage.getItem('auth_user');
    if (user) {
      this.currentUserId = JSON.parse(user)?.id;
    }
    // Validar y obtener el usuario
    if (this.currentUserId) {
      this.userService.getByIdSignal(this.currentUserId);
    } else {
      console.error('El usuario no está autenticado');
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
      const sanitizedUser = this.sanitizeUser(this.user);
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
    
    async cargarDatosUsuario(): Promise<void> {
      try {
        await this.userService.getByIdSignal(this.currentUserId!);
    
        // Accede al usuario a través de la señal después de que la promesa se resuelva
        const user = this.userService.user$();
    
        if (user) {  
          this.user = user;
          this.propiedad.user = user;
          console.log("User: ",this.user)
        } else {
          throw new Error('Usuario no encontrado');
        }
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
        throw error;
      }
    }
    
    
    
    ngOnInit() {
      this.cargarDatosUsuario().then(() => {
        this.service.getAllSignal();
        this.service.getProvincias();
        this.service.getCantones();
        this.service.getDistritos();
        this.amenidadService.getAllSignal();
        this.tipoPropService.getAllSignal();
      }).catch((error) => {
        console.error('Error al cargar el usuario:', error);
      });
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
    
    onUbicacionChange(params: IUbicacion) {
      this.propiedad.ubicacion = params;
      console.log("Ubicacion en propiedad:", this.propiedad.ubicacion);
    }
  onAmenidadChange(params: IAmenidad[]){
    console.log("onAmenidadChange", params)

    this.propiedad.amenidades = params;
  }

  onTipoPropiedadChange(params: ITipoPropiedad){
    console.log("onTipoPropiedadChange", params)

    this.propiedad.tipoPropiedad = params;
  }
  onImagenesRegistrar(params: IImagen[]) {
    console.log("onImagenesRegistrar", params)
    
    this.propiedad.listaImagenes = params;
  }

  onMonedaChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.currency = this.currencies.find(curren => (curren.value?.toString() ?? '') === selectedId) || {
      viewValue: "",
      value: ""
    };
    this.propiedad.moneda = this.currency.value;
    this.monedaTouched = true;
    this.monedaInvalid = !this.currency.value;
  }

  volverHome() {
    this.router.navigateByUrl('/app/home');
  }
}
