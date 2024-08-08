import { Component } from '@angular/core';
import { CalificacionUsuarioComponent } from '../../components/calificacion/calificacion-usuario/calificacion-usuario.component';
import { AdminItemComponent } from "../../components/admin-item/admin-item.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CalificacionUsuarioComponent, AdminItemComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
