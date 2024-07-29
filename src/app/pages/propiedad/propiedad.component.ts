import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropiedadService } from '../../services/propiedad.service';
import { IPropiedad } from '../../interfaces';

@Component({
  selector: 'app-propiedad',
  standalone: true,
  imports: [],
  templateUrl: './propiedad.component.html',
  styleUrl: './propiedad.component.scss'
})
export class PropiedadComponent {
  protected propiedadId: number;
  protected propiedad: IPropiedad = {};
  private service = inject(PropiedadService);

  constructor(private route: ActivatedRoute) {
    this.propiedadId = parseInt(this.route.snapshot.paramMap.get('id') ?? '0', 10);

    try {
      this.service.getByIdSignal(this.propiedadId);
      effect(() => {
        this.propiedad = this.service.propiedad$();
        console.log(this.propiedad);
      })
    } catch(error) {
      console.error("El id no está en un formato correcto o no existe: " + error);
    }
  }
}
