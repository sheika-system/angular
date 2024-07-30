import { Component, Input } from '@angular/core';
import { PropiedadCardComponent } from '../propiedad-card/propiedad-card.component';
import { IPropiedad } from '../../../interfaces';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-propiedad-generador',
  standalone: true,
  imports: [PropiedadCardComponent, CommonModule],
  templateUrl: './propiedad-generador.component.html',
  styleUrl: './propiedad-generador.component.scss'
})
export class PropiedadGeneradorComponent {
  @Input() rows: IPropiedad[][] = [];
}
