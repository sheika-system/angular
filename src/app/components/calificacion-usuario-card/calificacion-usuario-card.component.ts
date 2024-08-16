import { Component, Input } from '@angular/core';
import { CalificacionUsuarioService } from '../../services/calificaion-usuario.service'; // Asegúrate de que la ruta es correcta
import { ICalificacionUsuario} from '../../interfaces';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-calificacion-usuario-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calificacion-usuario-card.component.html',
  styleUrls: ['./calificacion-usuario-card.component.scss'],
})
export class CalificacionUsuarioCardComponent {
  @Input() usuarioId!: number ;
  calificacionPromedio: number = 0;

  constructor(private calificacionUsuarioService: CalificacionUsuarioService) {}

  ngOnInit() {
    this.obtenerCalificaciones();
    
  }

  obtenerCalificaciones() {
    this.calificacionUsuarioService.getByUsuarioCalificadoId(this.usuarioId).subscribe({
      next: (calificaciones: ICalificacionUsuario[]) => {
        console.log(calificaciones.length)
        if (calificaciones.length > 0) {
          const suma = calificaciones.reduce((total, calificacion) => total + (calificacion.valor || 0), 0);
          this.calificacionPromedio = suma / calificaciones.length;

        } else {
          this.calificacionPromedio = 0;
        }
      },
      error: (error) => {
        console.error('Error al obtener calificaciones', error);
        this.calificacionPromedio = 0;
      }
    });
  }
}
