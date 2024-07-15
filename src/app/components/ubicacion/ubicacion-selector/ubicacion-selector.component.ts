import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
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
export class UbicacionSelectorComponent{
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

  @Output() ubicacionChange: EventEmitter<IUbicacion> = new EventEmitter<IUbicacion>();

  cantonesFiltrados: ICanton[] = [];
  distritosFiltrados: IDistrito[] = [];

  provinciaInvalid = false;
  cantonInvalid = false;
  distritoInvalid = false;

  provinciaTouched = false;
  cantonTouched = false;
  distritoTouched = false;

  onProvinciaChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.ubicacion.provincia = this.provincias.find(prov => (prov.provinciaId?.toString() ?? '') === selectedId);

    this.cantonesFiltrados = this.cantones.filter(cant => cant.provincia?.provinciaId === this.ubicacion.provincia?.provinciaId);
    this.ubicacion.canton = { cantonId: undefined, nombre: "" };
    this.distritosFiltrados = [];
    this.ubicacion.distrito = { distritoId: undefined, nombre: "" };

    this.provinciaTouched = true;
    this.provinciaInvalid = !this.ubicacion.provincia;
    this.emitUbicacion();
  }

  onCantonChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.ubicacion.canton = this.cantones.find(cant => (cant.cantonId?.toString() ?? '') === selectedId);

    this.distritosFiltrados = this.distritos.filter(dist => dist.canton?.cantonId === this.ubicacion.canton?.cantonId);

    this.cantonTouched = true;
    this.cantonInvalid = !this.ubicacion.canton;
    this.emitUbicacion();
  }

  onDistritoChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.ubicacion.distrito = this.distritos.find(dist => (dist.distritoId?.toString() ?? '') === selectedId);
    this.distritoTouched = true;
    this.distritoInvalid = !this.ubicacion.distrito;
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