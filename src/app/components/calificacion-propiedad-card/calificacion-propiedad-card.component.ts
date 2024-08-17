import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalificacionPropiedadService } from '../../services/calificacion-propiedad.service'; // Asegúrate de que la ruta es correcta
import { ICalificacionPropiedad } from '../../interfaces';

@Component({
  selector: 'app-calificacion-propiedad-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './calificacion-propiedad-card.component.html',
  styleUrls: ['./calificacion-propiedad-card.component.scss'],
})
export class CalificacionPropiedadCardComponent implements OnInit {
  @Input() propiedadId!: number ;
  calificacionPromedio: number = 0;

  constructor(private calificacionPropiedadService: CalificacionPropiedadService) {}

  ngOnInit() {
    this.obtenerCalificaciones();
    
  }

  obtenerCalificaciones() {
    this.calificacionPropiedadService.getByPropiedadCalificadaId(this.propiedadId).subscribe({
      next: (calificaciones: ICalificacionPropiedad[]) => {
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
