import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IPuntoInteres, IRecorrido3D } from '@app/interfaces';
import { PuntoInteresService } from '@app/services/punto-interes.service';

@Component({
  selector: 'app-puntointeres-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './puntointeres-form.component.html',
  styleUrl: './puntointeres-form.component.scss'
})
export class PuntointeresFormComponent implements OnChanges, OnInit  {
  @Input() posicionX!: number;
  @Input() posicionY!: number;
  @Input() recorrido3D!: IRecorrido3D;
  @Input() escenaId!: string;
  @Output() puntoInteresAdded = new EventEmitter<IPuntoInteres>();
  @Output() cancel = new EventEmitter<void>();

  nombrePuntoInteres = '';
  private puntoInteresService = inject(PuntoInteresService);

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['escenaId']) {
    }
  }

  onAdd() {
    if (this.nombrePuntoInteres.trim() && this.recorrido3D && this.escenaId) {
      const newPuntoInteres: IPuntoInteres = {
        nombre: this.nombrePuntoInteres,
        posicionX: this.posicionX,
        posicionY: this.posicionY,
        recorrido3dId: this.recorrido3D.recorrido3dId,
        escenaId: this.escenaId
      };

      this.puntoInteresService.savePuntoInteresSignal(newPuntoInteres).subscribe({
        next: (savedPuntoInteres) => {
          this.puntoInteresAdded.emit(savedPuntoInteres);
          this.resetForm();
        },
        error: (error) => console.error('Error al guardar punto de interés:', error)
      });
    } else {
      console.error('Datos incompletos para guardar el punto de interés', {
        nombre: this.nombrePuntoInteres,
        recorrido3D: this.recorrido3D,
        escenaId: this.escenaId
      });
    }
  }

  onCancel() {
    this.cancel.emit();
    this.resetForm();
  }

  private resetForm() {
    this.nombrePuntoInteres = '';
  }
}