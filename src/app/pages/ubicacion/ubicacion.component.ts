import { Component, effect, inject } from '@angular/core';
import { UbicacionListComponent } from '../../components/ubicacion/ubicacion-list/ubicacion-list.component';
import { UbicacionFormComponent } from '../../components/ubicacion/ubicacion-form/ubicacion-form.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ICanton, IDistrito, IProvincia, IUbicacion } from '../../interfaces';
import { UbicacionService } from '../../services/ubicacion.service';
import { UbicacionSelectorComponent } from '../../components/ubicacion/ubicacion-selector/ubicacion-selector.component';

@Component({
  selector: 'app-ubicacion',
  standalone: true,
  imports: [
    UbicacionListComponent,
    UbicacionFormComponent,
    ModalComponent,
    LoaderComponent,
    UbicacionSelectorComponent
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

  ngOnInit() {
    this.service.getAllSignal();
    this.service.getProvincias();
    this.service.getCantones();
    this.service.getDistritos();
  }

  onUbicacionChange(params: IUbicacion) {
    // this.ubicacionTest = params;
    console.log('Ubicación actualizada:', params);
    // Aquí puedes realizar acciones adicionales si es necesario
  }
  
}
