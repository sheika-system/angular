import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { TipoPropiedadService } from '../../services/tipo-propiedad.service';
import { AmenidadService } from '../../services/amenidad.service';
import { UbicacionService } from '../../services/ubicacion.service';
import { ITipoPropiedad, IAmenidad, IUbicacion } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { TipoPropiedadComponent } from '../../components/tipo-propiedad/tipo-propiedad.component';
import { AmenidadComponent } from '../../components/amenidad/amenidad.component';
import { UbicacionSelectorComponent } from '../../components/ubicacion/ubicacion-selector/ubicacion-selector.component';


@Component({
  selector: 'app-filters',
  templateUrl: './filters.component.html',
  styleUrls: ['./filters.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatSliderModule,
    CommonModule,
    TipoPropiedadComponent,
    AmenidadComponent,
    UbicacionSelectorComponent
  ]
})
export class FiltersComponent implements OnInit {
  tipoPropService = inject(TipoPropiedadService);
  amenidadService = inject(AmenidadService);
  service = inject(UbicacionService);
  @Output() filtersChanged = new EventEmitter<any>();

  filters = {
    priceRange: [0, 10000],
    propertyType: '',
    provincia: '',
    canton:'',
    distrito:'',
    amenities: [] as string[],
    areaRange: [0, 1000]
  };

  tipoPropiedad: ITipoPropiedad = {
    tipoPropiedadId: 0,
    nombre: ''
  };

  listaAmenidades: IAmenidad[] = [{
    amenidadId: 0,
    nombre: ''
  }]



  constructor() {}

  ngOnInit() {
    this.tipoPropService.getAllSignal();
    this.amenidadService.getAllSignal();
    this.service.getProvincias();
    this.service.getCantones();
    this.service.getDistritos();
  }

  onTipoPropiedadChange(tipoPropiedad: ITipoPropiedad) {
    this.filters.propertyType = tipoPropiedad.nombre ?? '';
    this.applyFilters();
  }

  onAmenidadesChange(amenidades: IAmenidad[]) {
    this.filters.amenities = amenidades.map(a => a.nombre);
    this.applyFilters();
  }

  onUbicacionChange(ubicacion: IUbicacion) {
    this.filters.provincia= ubicacion.provincia?.nombre ?? '';
    this.filters.canton= ubicacion.canton?.nombre ?? '';
    this.filters.distrito= ubicacion.distrito?.nombre ?? '';
    this.applyFilters();
  }

  applyFilters() {
    this.filtersChanged.emit(this.filters);
  }
}
