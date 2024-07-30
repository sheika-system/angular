import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropiedadService } from '../../services/propiedad.service';
import { IPropiedad, IImagen } from '../../interfaces';
import { ImagenComponent } from '../../components/imagen/imagen.component';
import { ImagenModalComponent } from '../../components/imagen/imagen-modal/imagen-modal.component';

@Component({
  selector: 'app-propiedad',
  standalone: true,
  imports: [ImagenComponent, ImagenModalComponent],
  templateUrl: './detalle-propiedad.component.html',
  styleUrl: './detalle-propiedad.component.scss'
})
export class PropiedadComponent{
  protected propiedadId: number;
  listaImagenes: IImagen[] = [];
  protected propiedad: IPropiedad = {
    listaImagenes: this.listaImagenes
  };
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

  volverInicio() {
    window.location.assign('/app/home');
  }
}
