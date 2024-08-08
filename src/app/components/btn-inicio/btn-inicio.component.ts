import { Component } from '@angular/core';

@Component({
  selector: 'btn-inicio',
  standalone: true,
  imports: [],
  templateUrl: './btn-inicio.component.html',
  styleUrl: './btn-inicio.component.scss'
})
export class BtnInicioComponent {
  volverInicio() {
    window.location.assign('/home');
  }
}
