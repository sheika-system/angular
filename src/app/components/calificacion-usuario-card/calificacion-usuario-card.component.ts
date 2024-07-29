import { Component, Input } from '@angular/core';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-calificacion-usuario-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calificacion-usuario-card.component.html',
  styleUrls: ['./calificacion-usuario-card.component.scss'],
})
export class CalificacionUsuarioCardComponent {
  @Input() nombre: string = '';
  @Input() imagen: string = '';
  @Input() calificacionPromedio: number = 0;
}