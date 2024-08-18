import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { IPuntoInteres } from '@app/interfaces';
import { PuntoInteresService } from '@app/services/punto-interes.service';

@Component({
  selector: 'app-puntointeres-info',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './puntointeres-info.component.html',
  styleUrl: './puntointeres-info.component.scss'
})
export class PuntointeresInfoComponent {
  @Input() puntoInteres!: IPuntoInteres;
  @Input() position?: { x: number, y: number };
  @Output() puntoInteresDeleted = new EventEmitter<IPuntoInteres>();

  private puntoInteresService = inject(PuntoInteresService);

  onDelete() {
    if (this.puntoInteres.puntoInteresId) {
      this.puntoInteresService.deletePuntoInteres(this.puntoInteres).subscribe({
        next: () => {
          this.puntoInteresDeleted.emit(this.puntoInteres);
        },
        error: (error) => console.error('Error al eliminar punto de interés:', error)
      });
    }
  }
}