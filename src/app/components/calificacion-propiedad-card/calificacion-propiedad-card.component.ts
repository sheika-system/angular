import { Component, Input } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-calificacion-propiedad-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calificacion-propiedad-card.component.html',
  styleUrls: ['./calificacion-propiedad-card.component.scss'],
})
export class CalificacionPropiedadCardComponent {
  @Input() nombre: string = '';
  @Input() imagen: string = '';
  @Input() calificacionPromedio: number = 0;
}