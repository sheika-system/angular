import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ICanton, IDistrito, IProvincia, IUbicacion } from '../../../interfaces';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ubicacion-selector',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './ubicacion-selector.component.html',
  styleUrls: ['./ubicacion-selector.component.scss']
})
export class UbicacionSelectorComponent implements OnChanges{
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ubicacion']) {
      this.actualizarListasFiltradas();
      this.actualizarValidacion();
    }
  }
  @Input() mostrarNombres: boolean = true;
  @Input() ubicacion: IUbicacion = {
    direccion: "",
    latitud: 0,
    longitud: 0,
    provincia: { provinciaId: undefined , nombre: "" },
    canton: { cantonId: undefined, nombre: "" },
    distrito: { distritoId: undefined, nombre: "" }
  };

  @Input() provincias: IProvincia[] = [];
  @Input() cantones: ICanton[] = [];
  @Input() distritos: IDistrito[] = [];
  @Input() mostrarDireccion: boolean = true;

  @Output() ubicacionChange: EventEmitter<IUbicacion> = new EventEmitter<IUbicacion>();

  cantonesFiltrados: ICanton[] = [];
  distritosFiltrados: IDistrito[] = [];

  provinciaInvalid = false;
  cantonInvalid = false;
  distritoInvalid = false;

  provinciaTouched = false;
  cantonTouched = false;
  distritoTouched = false;

  private actualizarListasFiltradas() {
    if (this.ubicacion.provincia?.provinciaId) {
      this.cantonesFiltrados = this.cantones.filter(cant => 
        cant.provincia?.provinciaId === this.ubicacion.provincia?.provinciaId
      );

      if (this.ubicacion.canton?.cantonId) {
        this.distritosFiltrados = this.distritos.filter(dist => 
          dist.canton?.cantonId === this.ubicacion.canton?.cantonId
        );
      } else {
        this.distritosFiltrados = [];
      }
    } else {
      this.cantonesFiltrados = [];
      this.distritosFiltrados = [];
    }
  }

  private actualizarValidacion() {
    if(!this.ubicacion.provincia?.provinciaId && !this.ubicacion.canton?.cantonId && !this.ubicacion.distrito?.distritoId){
      this.provinciaInvalid = false;
      this.cantonInvalid = false;
      this.distritoInvalid = false;
      this.provinciaTouched = false;
      this.cantonTouched = false;
      this.distritoTouched = false;
    }else{
      this.provinciaInvalid = !this.ubicacion.provincia?.provinciaId;
      this.cantonInvalid = !this.ubicacion.canton?.cantonId;
      this.distritoInvalid = !this.ubicacion.distrito?.distritoId;

      this.provinciaTouched = true;
      this.cantonTouched = true;
      this.distritoTouched = true;
    }
    
  }

  onProvinciaChange(event: Event) {
    console.log("dropdown provincias");
    const selectedId = (event.target as HTMLSelectElement).value;
    this.ubicacion.provincia = this.provincias.find(prov => (prov.provinciaId?.toString() ?? '') === selectedId);

    this.cantonesFiltrados = this.cantones.filter(cant => cant.provincia?.provinciaId === this.ubicacion.provincia?.provinciaId);
    this.ubicacion.canton = { cantonId: undefined, nombre: "" };
    this.distritosFiltrados = [];
    this.ubicacion.distrito = { distritoId: undefined, nombre: "" };

    this.provinciaTouched = true;
    this.provinciaInvalid = !this.ubicacion.provincia;
    this.actualizarValidacion();
    this.emitUbicacion();
  }

  onCantonChange(event: Event) {
    console.log("dropdown cantones");
    const selectedId = (event.target as HTMLSelectElement).value;
    this.ubicacion.canton = this.cantones.find(cant => (cant.cantonId?.toString() ?? '') === selectedId);

    this.distritosFiltrados = this.distritos.filter(dist => dist.canton?.cantonId === this.ubicacion.canton?.cantonId);

    this.cantonTouched = true;
    this.cantonInvalid = !this.ubicacion.canton;
    this.actualizarValidacion();
    this.emitUbicacion();
  }

  onDistritoChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.ubicacion.distrito = this.distritos.find(dist => (dist.distritoId?.toString() ?? '') === selectedId);
    this.distritoTouched = true;
    this.distritoInvalid = !this.ubicacion.distrito;
    this.actualizarValidacion();
    this.emitUbicacion();
  }

  onDireccionChange(value: string) {
    this.ubicacion.direccion = value;
    this.emitUbicacion();
  }

  onLatitudChange(value: number) {
    this.ubicacion.latitud = value;
    this.emitUbicacion();
  }

  onLongitudChange(value: number) {
    this.ubicacion.longitud = value;
    this.emitUbicacion();
  }

  private emitUbicacion() {
    this.ubicacionChange.emit(this.ubicacion);
  }
}