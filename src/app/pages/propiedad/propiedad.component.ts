import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TopbarComponent } from '../../components/app-layout/elements/topbar/topbar.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { UbicacionSelectorComponent } from '../../components/ubicacion/ubicacion-selector/ubicacion-selector.component';
import { IAmenidad, ICurrency, IImagen, IPropiedad, ITipoPropiedad, IUbicacion, IUser } from '../../interfaces';
import { UbicacionComponent } from "../ubicacion/ubicacion.component";
import { UbicacionService } from '../../services/ubicacion.service';
import { AmenidadComponent } from "../../components/amenidad/amenidad.component";
import { TipoPropiedadComponent } from "../../components/tipo-propiedad/tipo-propiedad.component";
import { ImagenComponent } from "../../components/imagen/imagen.component";
import { AmenidadService } from '../../services/amenidad.service';
import { TipoPropiedadService } from '../../services/tipo-propiedad.service';
import { PropiedadService } from '../../services/propiedad.service';
import { ImagenService } from '../../services/imagen.service';
import { UbicacionFormComponent } from "../../components/ubicacion/ubicacion-form/ubicacion-form.component";
import { MapComponent } from "../../components/map/map.component";
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { UserService } from '../../services/user.service';
import { BtnInicioComponent } from "../../components/btn-inicio/btn-inicio.component";

@Component({
  selector: 'app-propiedad',
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
  templateUrl: './propiedad.component.html',
  styleUrls: ['./propiedad.component.scss']
})
export class PropiedadComponent implements OnInit {
  service = inject(UbicacionService);
  amenidadService = inject(AmenidadService);
  tipoPropService = inject(TipoPropiedadService);
  imagenService = inject(ImagenService);
  userService = inject(UserService)

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  public registerError!: String;
  public validregister!: boolean;
  monedaInvalid = false;
  monedaTouched = false;

  currentUserId: number | undefined;
  user: IUser = {};
  id: number | undefined;


  private snackBar = inject(MatSnackBar);

  ubicacionMaps: IUbicacion = {
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

  propiedad: IPropiedad = {
    nombre: '',
    descripcion: '',
    tipoPropiedad: this.tipoPropiedad,
    moneda: this.currency.value,
    precio: 0,
    ubicacion: { ...this.ubicacionMaps }, // Crea una copia de ubicacionMaps
    amenidades: this.listaAmenidades,
    annioConstruccion: 0,
    cuartosCant: 0,
    banniosCant: 0,
    metrosCuadrados: 0,
    disponibilidad: true,
    listaImagenes: [],
    user: undefined
  };


  // Parte de google maps

  resetUbicacion($event: boolean) {
    if ($event) {
      // Reiniciar ubicacionMaps
      this.ubicacionMaps = {
        direccion: "",
        latitud: 0,
        longitud: 0,
        provincia: { provinciaId: undefined, nombre: "" },
        canton: { cantonId: undefined, nombre: "" },
        distrito: { distritoId: undefined, nombre: "" }
      };

  
      // Reiniciar el paginador
      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }
  
      // Limpiar cualquier entrada en el campo de búsqueda
      const inputElement = document.querySelector('input[matInput]') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
  
  
      // Opcional: Notificar al usuario
      this.snackBar.open('Filtros de ubicación reiniciados', 'Cerrar', {
        duration: 3000
      });
    }
  }

  normalizeLocation(str: string): string {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ""); // Elimina caracteres especiales excepto espacios
  }

  private buildLocationFilter(): string {
    const locationFilters = [];
    if (this.ubicacionMaps.provincia?.nombre) {
      locationFilters.push(`provincia:${this.normalizeLocation(this.ubicacionMaps.provincia.nombre)}`);
    }
    if (this.ubicacionMaps.canton?.nombre) {
      locationFilters.push(`canton:${this.normalizeLocation(this.ubicacionMaps.canton.nombre)}`);
    }
    if (this.ubicacionMaps.distrito?.nombre) {
      locationFilters.push(`distrito:${this.normalizeLocation(this.ubicacionMaps.distrito.nombre)}`);
    }
    return locationFilters.join(' AND ');
  }

  
  
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
  
  
  onSubmit() {

    if (
      (this.propiedad.precio ?? 0) < 0 || 
      (this.propiedad.annioConstruccion ?? 0) < 0 ||
      (this.propiedad.cuartosCant ?? 0) < 0 || 
      (this.propiedad.banniosCant ?? 0) < 0 ||
      (this.propiedad.metrosCuadrados ?? 0) < 0
    ) {
      this.registerError = 'Por favor, asegúrate de que todos los campos numéricos no tengan valores negativos.';
      return;
    }
    if(
      (this.propiedad.nombre) == '' ||
      (this.propiedad.descripcion) == '' ||
      (this.propiedad.tipoPropiedad) == undefined ||
      (this.propiedad.moneda) == '' ||
      (this.propiedad.precio ?? 0) <= 0 ||
      (this.propiedad.ubicacion) == undefined ||
      (this.propiedad.annioConstruccion?? 0) <= 0 ||
      (this.propiedad.banniosCant?? 0) < 0 ||
      (this.propiedad.cuartosCant?? 0) < 0 ||
      (this.propiedad.metrosCuadrados?? 0) <= 0 
    ) {
      this.registerError = 'Por favor, asegúrate de que todos los campos esten completos';
      return;
    }

    if(this.propiedad.user?.id == undefined) {
      this.registerError = 'Usuario no encontrado, intente mas tarde'
      return
    }

    // Crear una copia de propiedad para no modificar el original directamente
    let propiedadToSubmit = { ...this.propiedad };

  // Comprobar si existe user y authorities
    if (propiedadToSubmit.user && 'authorities' in propiedadToSubmit.user) {
    // Crear una nueva copia del usuario sin authorities
    const { authorities, ...userWithoutAuthorities } = propiedadToSubmit.user;
    
    // Actualizar el user en la copia de propiedad
    propiedadToSubmit.user = userWithoutAuthorities;
  }
    this.propiedadService.add(propiedadToSubmit).subscribe({
        next: (response) => {
          console.log('Propiedad registrada con éxito', response);
          this.validregister = true;
          setTimeout(() => {
            this.router.navigateByUrl('/app/perfil/'+ propiedadToSubmit.user?.id)
          }, 1000);
        },
        error: (err) => (this.registerError = err)
      });
      console.log(propiedadToSubmit)
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
        
        if (!this.propiedad.ubicacion) {
          this.propiedad.ubicacion = { ...this.ubicacionMaps };
        }
      }).catch((error) => {
        console.error('Error al cargar el usuario:', error);
        this.registerError = 'Error al cargar el usuario';
      });
    }
    
    updateUbicacionAndFilter(newUbicacion: Partial<IUbicacion>) {
      this.ubicacionMaps = { ...this.ubicacionMaps, ...newUbicacion };
      this.buildLocationFilter();
    }
  
    onMapSelectedLocation(mapInfo: any) {
      let provinciaEncontrada: any;
      let cantonEncontrado: any;
      let distritoEncontrado: any;
  
      if (mapInfo.markerPosition && mapInfo.selectedLocation) {
        this.ubicacionMaps = {
          ...this.ubicacionMaps,
          latitud: mapInfo.markerPosition.lat,
          longitud: mapInfo.markerPosition.lng
        };
  
        // Setear provincia
        if (mapInfo.selectedLocation.provincia !== '') {
          provinciaEncontrada = this.service.provincias$().find(
            p => p.nombre.toLowerCase() === mapInfo.selectedLocation.provincia.toLowerCase()
          );
          if (provinciaEncontrada) {
            this.ubicacionMaps.provincia = provinciaEncontrada;
          }
        } else {
          this.ubicacionMaps.provincia = undefined;
        }
  
        // Setear cantón
        if (mapInfo.selectedLocation.canton !== '') {
          cantonEncontrado = this.service.cantones$().find(
            c => c.nombre.toLowerCase() === mapInfo.selectedLocation.canton.toLowerCase() &&
                c.provincia?.provinciaId === this.ubicacionMaps.provincia?.provinciaId
          );
          if (cantonEncontrado) {
            this.ubicacionMaps.canton = cantonEncontrado;
          } else {
            this.ubicacionMaps.canton = undefined;
          }
        } else if(mapInfo.selectedLocation.canton == '' && mapInfo.selectedLocation.distrito !== ''){
          // Buscamos el distrito
          distritoEncontrado = this.service.distritos$().find(
            d => d.nombre.toLowerCase() === mapInfo.selectedLocation.distrito.toLowerCase() &&
                d.canton?.provincia?.provinciaId === provinciaEncontrada.provinciaId
          );
          // Buscamos el canton por medio del distrito
          cantonEncontrado = this.service.cantones$().find(
            c => c.cantonId === distritoEncontrado?.canton?.cantonId
          );
          if (cantonEncontrado) {
            this.ubicacionMaps.canton = cantonEncontrado;
          } else {
            this.ubicacionMaps.canton = undefined;
          }
  
        }else{
          this.ubicacionMaps.canton = undefined;
        }
        
        if(!distritoEncontrado){
          // Setear distrito
          if (mapInfo.selectedLocation.distrito !== '') {
            distritoEncontrado = this.service.distritos$().find(
              d => d.nombre.toLowerCase() === mapInfo.selectedLocation.distrito.toLowerCase() &&
                  d.canton?.cantonId === this.ubicacionMaps.canton?.cantonId
            );
            if (distritoEncontrado) {
              this.ubicacionMaps.distrito = distritoEncontrado;
            } else {
              this.ubicacionMaps.distrito = undefined;
            }
          } else {
            this.ubicacionMaps.distrito = undefined;
          }
        }else{
          this.ubicacionMaps.distrito = distritoEncontrado;
        }
      }
      this.updateUbicacionAndFilter(this.ubicacionMaps);

      this.onUbicacionChange(this.ubicacionMaps)
    }
    
    onUbicacionChange(params: IUbicacion) {
      this.ubicacionMaps = { ...params };
      
      this.propiedad = {
        ...this.propiedad,
        ubicacion: { ...params }
      };
      console.log('Ubicación actualizada:', this.ubicacionMaps);
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