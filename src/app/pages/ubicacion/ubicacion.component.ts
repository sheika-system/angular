import { Component, EventEmitter, Output, inject } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UbicacionListComponent } from '../../components/ubicacion/ubicacion-list/ubicacion-list.component';
import { UbicacionFormComponent } from '../../components/ubicacion/ubicacion-form/ubicacion-form.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ICanton, IDistrito, IProvincia, IUbicacion } from '../../interfaces';
import { UbicacionService } from '../../services/ubicacion.service';
import { UbicacionSelectorComponent } from '../../components/ubicacion/ubicacion-selector/ubicacion-selector.component';
import { IAmenidad, ITipoPropiedad } from '../../interfaces';
import { AmenidadComponent } from "../../components/amenidad/amenidad.component";
import { AmenidadService } from '../../services/amenidad.service';
import { TipoPropiedadComponent } from "../../components/tipo-propiedad/tipo-propiedad.component";
import { TipoPropiedadService } from '../../services/tipo-propiedad.service';
import { MapComponent } from "../../components/map/map.component";
import { DelitoComponent } from "../../components/delito/delito.component";


@Component({
  selector: 'app-ubicacion',
  standalone: true,
  imports: [
    UbicacionListComponent,
    UbicacionFormComponent,
    ModalComponent,
    LoaderComponent,
    UbicacionSelectorComponent,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    AmenidadComponent,
    TipoPropiedadComponent
    MapComponent,
    DelitoComponent,
    DelitoComponent

],
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.scss']
})
export class UbicacionComponent {
  service = inject(UbicacionService);
  amenidadService = inject(AmenidadService)
  tipoPropService = inject(TipoPropiedadService)
  selected = 'option2';

  ubicacionTest: IUbicacion = {
    direccion: "",
    latitud: 0,
    longitud: 0,
    provincia: { provinciaId: undefined, nombre: "" },
    canton: { cantonId: undefined, nombre: "" },
    distrito: { distritoId: undefined, nombre: "" }
  };


  // amenitiesControl = new FormControl<IAmenidad[]>([]);
  // amenitiesList: IAmenidad[] = [
  //   { amenidadId: 1, nombre: 'Amenities' },
  //   { amenidadId: 2, nombre: 'Air Conditioning' },
  //   { amenidadId: 3, nombre: 'Barbeque' },
  //   { amenidadId: 4, nombre: 'Dryer' },
  //   { amenidadId: 5, nombre: 'Gym' },
  //   { amenidadId: 6, nombre: 'Lawn' },
  //   { amenidadId: 7, nombre: 'Microwave' },
  //   { amenidadId: 8, nombre: 'Outdoor Shower' },
  //   { amenidadId: 9, nombre: 'Refrigerator' },
  //   { amenidadId: 10, nombre: 'Swimming Pool' },
  //   { amenidadId: 11, nombre: 'TV Cable' },
  //   { amenidadId: 12, nombre: 'Washer' },
  //   { amenidadId: 13, nombre: 'WiFi' }
  // ];

  // @Output() selectionChange = new EventEmitter<number[]>();

  ubicacionUpdated: IUbicacion = {
    direccion: "",
    latitud: 0,
    longitud: 0,
    provincia: { provinciaId: undefined , nombre: "" },
    canton: { cantonId: undefined, nombre: "" },
    distrito: { distritoId: undefined, nombre: "" }
  };

  mapsLocation: any = null;


  ngOnInit() {
    this.service.getAllSignal();
    this.service.getProvincias();
    this.service.getCantones();
    this.service.getDistritos();
    this.amenidadService.getAllSignal();
    this.tipoPropService.getAllSignal();
  }


  onMapSelectedLocation(mapInfo: any) {
    if (mapInfo.markerPosition && mapInfo.selectedLocation) {
      this.ubicacionTest = {
        ...this.ubicacionTest,
        latitud: mapInfo.markerPosition.lat,
        longitud: mapInfo.markerPosition.lng
      };

      // Setear provincia
      if (mapInfo.selectedLocation.provincia !== 'No disponible') {
        const provinciaEncontrada = this.service.provincias$().find(
          p => p.nombre.toLowerCase() === mapInfo.selectedLocation.provincia.toLowerCase()
        );
        if (provinciaEncontrada) {
          this.ubicacionTest.provincia = provinciaEncontrada;
        }
      } else {
        this.ubicacionTest.provincia = undefined;
      }

      // Setear cantón
      if (mapInfo.selectedLocation.canton !== 'No disponible') {
        const cantonEncontrado = this.service.cantones$().find(
          c => c.nombre.toLowerCase() === mapInfo.selectedLocation.canton.toLowerCase() &&
              c.provincia?.provinciaId === this.ubicacionTest.provincia?.provinciaId
        );
        if (cantonEncontrado) {
          this.ubicacionTest.canton = cantonEncontrado;
        } else {
          this.ubicacionTest.canton = undefined;
        }
      } else if (this.ubicacionTest.provincia) {
        // Si el cantón no está disponible pero tenemos la provincia, intentamos encontrar el cantón
        const cantonesDeProvincia = this.service.cantones$().filter(
          c => c.provincia?.provinciaId === this.ubicacionTest.provincia?.provinciaId
        );
        if (cantonesDeProvincia.length === 1) {
          this.ubicacionTest.canton = cantonesDeProvincia[0];
        } else {
          this.ubicacionTest.canton = undefined;
        }
      } else {
        this.ubicacionTest.canton = undefined;
      }

      // Setear distrito
      if (mapInfo.selectedLocation.distrito !== 'No disponible') {
        const distritoEncontrado = this.service.distritos$().find(
          d => d.nombre.toLowerCase() === mapInfo.selectedLocation.distrito.toLowerCase() &&
              d.canton?.cantonId === this.ubicacionTest.canton?.cantonId
        );
        if (distritoEncontrado) {
          this.ubicacionTest.distrito = distritoEncontrado;
        } else {
          this.ubicacionTest.distrito = undefined;
        }
      } else {
        this.ubicacionTest.distrito = undefined;
      }
    }
  }

  onUbicacionChange(ubicacion: IUbicacion) {
    this.ubicacionTest = ubicacion;
    // Aquí puedes agregar lógica adicional si es necesario
    // Por ejemplo, actualizar el mapa con la nueva ubicación seleccionada

  }

  onAmenidadChange(params: IAmenidad[]){
    console.log("onAmenidadChange", params)
  }

  onTipoPropiedadChange(params: ITipoPropiedad){
    console.log("onTipoPropiedadChange", params)
  }

  // onSelectionChange(event: any) {
  //   const selectedAmenities = event.value as IAmenidad[];
  //   const selectedIds = selectedAmenities.map(amenity => amenity.amenidadId);
  //   this.selectionChange.emit(selectedIds);
  // }
  
}