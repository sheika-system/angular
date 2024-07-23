import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { TopbarComponent } from '../../components/app-layout/elements/topbar/topbar.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { UbicacionSelectorComponent } from '../../components/ubicacion/ubicacion-selector/ubicacion-selector.component';
import { IAmenidad, IImagen, IPropiedad, ITipoPropiedad, IUbicacion } from '../../interfaces';
import { UbicacionComponent } from "../ubicacion/ubicacion.component";

@Component({
  selector: 'app-propiedad',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatSelectModule,
    TopbarComponent,
    LoaderComponent,
    UbicacionSelectorComponent,
    ModalComponent,
    UbicacionComponent
],
  templateUrl: './propiedad.component.html',
  styleUrls: ['./propiedad.component.scss']
})
export class PropiedadComponent implements OnInit {

  @Input() tipoPropiedad: ITipoPropiedad = {
    tipoPropiedadId: 0,
    nombre: ''
  };

  @Input() ubicacion: IUbicacion = {};

  @Input() imagenes: IImagen[] = []; 

  @Input() propiedad: IPropiedad = {
    nombre: '',
    descripcion: '',
    tipoPropiedad: { tipoPropiedadId: 0, nombre: '' },
    moneda: '',
    precio: 0,
    ubicacion: this.ubicacion,
    amenidades: [],
    annioConstruccion: 0,
    cuartosCant: 0,
    banniosCant: 0,
    metrosCuadrados: 0,
    disponibilidad: false,
    listaImagenes: []
  };

  amenitiesControl = new FormControl<IAmenidad[]>([]);
  selectedTipoPropiedad: string = 'option2';
  amenidadesList: IAmenidad[] = []; 

  ngOnInit(): void {
    
  }

  onUbicacionChange(params: IUbicacion) {
    this.propiedad.ubicacion = params;
  }

  onAmenidadesChange(event: any) {
    const selectedAmenities = event.value as IAmenidad[];
    const selectedIds = selectedAmenities.map(amenity => amenity.amenidadId);
    this.propiedad.amenidades = this.amenidadesList.filter((amenidad: IAmenidad) => selectedIds.includes(amenidad.amenidadId));
  }
}
