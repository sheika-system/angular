import { Component } from '@angular/core';
import { CalificacionUsuarioComponent } from '../../components/calificacion/calificacion-usuario/calificacion-usuario.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CalificacionUsuarioComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
