import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ITipoPropiedad } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tipo-propiedad',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule],
  templateUrl: './tipo-propiedad.component.html',
  styleUrl: './tipo-propiedad.component.scss'
})
export class TipoPropiedadComponent {
  tipoPropiedad: ITipoPropiedad = {
    tipoPropiedadId: undefined,
    nombre: ""
  }

  @Input() tipoPropiedades: ITipoPropiedad[] = [];

  @Output() tipoPropiedadChange: EventEmitter<ITipoPropiedad> = new EventEmitter<ITipoPropiedad>();

  @Input() tipoPropiedadObtenida: ITipoPropiedad = this.tipoPropiedad;

  tipoPropiedadInvalid = false;
  tipoPropiedadTouched = false;

  onTipoPropiedadChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.tipoPropiedad = this.tipoPropiedades.find(tp => (tp.tipoPropiedadId?.toString() ?? '') === selectedId) || {
      tipoPropiedadId: undefined,
      nombre: ""
    };
    this.tipoPropiedadTouched = true;
    this.tipoPropiedadInvalid = !this.tipoPropiedad.tipoPropiedadId;
    this.emitTipoPropiedad();
  }


  private emitTipoPropiedad(){
    this.tipoPropiedadChange.emit(this.tipoPropiedad);
  }





}
