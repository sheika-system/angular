import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
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
import { UbicacionService } from '../../services/ubicacion.service';

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
    UbicacionComponent,
],
  templateUrl: './propiedad.component.html',
  styleUrls: ['./propiedad.component.scss']
})
export class PropiedadComponent implements OnInit {

  @Input() propiedad: IPropiedad = {
    nombre: '',
    descripcion: '',
    tipoPropiedad: { tipoPropiedadId: 0, nombre: '' },
    moneda: '',
    precio: 0,
    ubicacion: {
      direccion: "",
      latitud: 0,
      longitud: 0,
      provincia: { provinciaId: undefined , nombre: "" },
      canton: { cantonId: undefined, nombre: "" },
      distrito: { distritoId: undefined, nombre: "" }
    },
    amenidades: [],
    annioConstruccion: 0,
    cuartosCant: 0,
    banniosCant: 0,
    metrosCuadrados: 0,
    disponibilidad: false,
    listaImagenes: []
  };
  service = inject(UbicacionService);

  selectedCurrency: string | undefined;
  currencies = [
    { value: 'USD', viewValue: 'Dólar Estadounidense (USD)' },
    { value: 'CRC', viewValue: 'Colón Costarricense (CRC)' }
  ];


  ngOnInit() {
    this.service.getAllSignal();
    this.service.getProvincias();
    this.service.getCantones();
    this.service.getDistritos();
  }

  onUbicacionChange(params: IUbicacion) {
    this.propiedad.ubicacion = params;
    console.log('Ubicación actualizada:', this.propiedad.ubicacion);
  }
}
