import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropiedadService } from '../../services/propiedad.service';
import { IPropiedad, IImagen } from '../../interfaces';
import { ImagenComponent } from '../../components/imagen/imagen.component';
import { ImagenModalComponent } from '../../components/imagen/imagen-modal/imagen-modal.component';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../components/modal/modal.component';
import { BtnInicioComponent } from '../../components/btn-inicio/btn-inicio.component';
import { CalificacionPropiedadComponent } from "../../components/calificacion-propiedad/form-calificacion-propiedad/calificacion-propiedad.component";
import { CalificacionPropiedadCardComponent } from '../../components/calificacion-propiedad-card/calificacion-propiedad-card.component';
import { ComentarioPropiedadComponent} from '../../components/calificacion-propiedad/comentarios-propiedad/comentarios-propiedad';


@Component({
  selector: 'app-propiedad',
  standalone: true,
  imports: [ImagenComponent, ImagenModalComponent, ModalComponent, CommonModule, BtnInicioComponent, CalificacionPropiedadComponent,CalificacionPropiedadCardComponent,ComentarioPropiedadComponent],
  templateUrl: './detalle-propiedad.component.html',
  styleUrl: './detalle-propiedad.component.scss'
})
export class PropiedadDetalleComponent{
  protected propiedadId: number;
  protected currentUserId: string = '';
  listaImagenes: IImagen[] = [];
  protected propiedad: IPropiedad = {
    listaImagenes: this.listaImagenes
  };
  private service = inject(PropiedadService);
  

  constructor(private route: ActivatedRoute) {
    this.propiedadId = parseInt(this.route.snapshot.paramMap.get('id') ?? '0', 10);
    let user = localStorage.getItem('auth_user');
    if(user) {
      this.currentUserId = String(JSON.parse(user)?.id);
    }
    
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

  calificarPropiedad(modal: any) {
    modal.show();
  }
}
