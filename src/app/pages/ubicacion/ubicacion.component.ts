import { Component, effect, inject } from '@angular/core';
import { UbicacionListComponent } from '../../components/ubicacion/ubicacion-list/ubicacion-list.component';
import { UbicacionFormComponent } from '../../components/ubicacion/ubicacion-form/ubicacion-form.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ICanton, IDistrito, IProvincia, IUbicacion } from '../../interfaces';
import { UbicacionService } from '../../services/ubicacion.service';
import { UbicacionSelectorComponent } from '../../components/ubicacion/ubicacion-selector/ubicacion-selector.component';
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
    MapComponent,
    DelitoComponent,
    DelitoComponent
],
  templateUrl: './ubicacion.component.html',
  styleUrl: './ubicacion.component.scss'
})
export class UbicacionComponent {

  service = inject(UbicacionService);
  ubicacionTest: IUbicacion = {
    direccion: "",
    latitud: 0,
    longitud: 0,
    provincia: { provinciaId: undefined , nombre: "" },
    canton: { cantonId: undefined, nombre: "" },
    distrito: { distritoId: undefined, nombre: "" }
  };

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
  
}
