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
    ReactiveFormsModule
  ],
  templateUrl: './ubicacion.component.html',
  styleUrls: ['./ubicacion.component.scss']
})
export class UbicacionComponent {
  service = inject(UbicacionService);
  selected = 'option2';

  ubicacionTest: IUbicacion = {
    direccion: "",
    latitud: 0,
    longitud: 0,
    provincia: { provinciaId: undefined, nombre: "" },
    canton: { cantonId: undefined, nombre: "" },
    distrito: { distritoId: undefined, nombre: "" }
  };

  amenitiesControl = new FormControl<IAmenidad[]>([]);
  amenitiesList: IAmenidad[] = [
    { amenidadId: 1, nombre: 'Amenities' },
    { amenidadId: 2, nombre: 'Air Conditioning' },
    { amenidadId: 3, nombre: 'Barbeque' },
    { amenidadId: 4, nombre: 'Dryer' },
    { amenidadId: 5, nombre: 'Gym' },
    { amenidadId: 6, nombre: 'Lawn' },
    { amenidadId: 7, nombre: 'Microwave' },
    { amenidadId: 8, nombre: 'Outdoor Shower' },
    { amenidadId: 9, nombre: 'Refrigerator' },
    { amenidadId: 10, nombre: 'Swimming Pool' },
    { amenidadId: 11, nombre: 'TV Cable' },
    { amenidadId: 12, nombre: 'Washer' },
    { amenidadId: 13, nombre: 'WiFi' }
  ];

  @Output() selectionChange = new EventEmitter<number[]>();

  ngOnInit() {
    this.service.getAllSignal();
    this.service.getProvincias();
    this.service.getCantones();
    this.service.getDistritos();
  }

  onUbicacionChange(params: IUbicacion) {
    console.log('Ubicación actualizada:', params);
    // Aquí puedes realizar acciones adicionales si es necesario
  }

  onSelectionChange(event: any) {
    const selectedAmenities = event.value as IAmenidad[];
    const selectedIds = selectedAmenities.map(amenity => amenity.amenidadId);
    this.selectionChange.emit(selectedIds);
  }
  
}
