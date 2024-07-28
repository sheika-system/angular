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
import { AmenidadComponent } from "../../components/amenidad/amenidad.component";
import { TipoPropiedadComponent } from "../../components/tipo-propiedad/tipo-propiedad.component";
import { ImagenComponent } from "../../components/imagen/imagen.component";
import { AmenidadService } from '../../services/amenidad.service';
import { TipoPropiedadService } from '../../services/tipo-propiedad.service';
import { PropiedadService } from '../../services/propiedad.service';
import { ImagenService } from '../../services/imagen.service';

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
    AmenidadComponent,
    TipoPropiedadComponent,
    ImagenComponent
],
  templateUrl: './propiedad.component.html',
  styleUrls: ['./propiedad.component.scss']
})
export class PropiedadComponent implements OnInit {
  service = inject(UbicacionService);
  amenidadService = inject(AmenidadService);
  tipoPropService = inject(TipoPropiedadService);
  imagenService = inject(ImagenService);

  ubicacion: IUbicacion = {
    direccion: "",
    latitud: 0,
    longitud: 0,
    provincia: { provinciaId: undefined, nombre: "" },
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

  propiedad: IPropiedad = {
    nombre: '',
    descripcion: '',
    tipoPropiedad: this.tipoPropiedad,
    moneda: '',
    precio: 0,
    ubicacion: this.ubicacion,
    amenidades: this.listaAmenidades,
    annioConstruccion: 0,
    cuartosCant: 0,
    banniosCant: 0,
    metrosCuadrados: 0,
    disponibilidad: false,
    listaImagenes: []
  };


  selectedCurrency: string | undefined;
  currencies = [
    { value: 'USD', viewValue: 'Dólar Estadounidense (USD)' },
    { value: 'CRC', viewValue: 'Colón Costarricense (CRC)' }
  ];


  constructor(private propiedadService: PropiedadService) {}

  onSubmit() {
      this.propiedadService.add(this.propiedad).subscribe({
        next: (response) => {
          console.log('Propiedad registrada con éxito', response);
        },
        error: (err) => {
          console.error('Error al registrar la propiedad', err);
        }
      });
  }



  ngOnInit() {
    this.service.getAllSignal();
    this.service.getProvincias();
    this.service.getCantones();
    this.service.getDistritos();
    this.amenidadService.getAllSignal();
    this.tipoPropService.getAllSignal();
  }

  onUbicacionChange(params: IUbicacion) {
    this.propiedad.ubicacion = params;
    console.log('Ubicación actualizada:', this.propiedad.ubicacion);
  }
  onAmenidadChange(params: IAmenidad[]){
    console.log("onAmenidadChange", params)
  }

  onTipoPropiedadChange(params: ITipoPropiedad){
    console.log("onTipoPropiedadChange", params)
  }
  onImagenesRegistrar(params: IImagen[]) {
    console.log("onImagenesRegistrar", params)
  }
}
