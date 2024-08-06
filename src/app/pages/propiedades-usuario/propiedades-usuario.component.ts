import { Component, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropiedadService } from '../../services/propiedad.service';
import { IPropiedad } from '../../interfaces';
import { PropiedadGeneradorComponent } from '../../components/lista-propiedad/propiedad-generador/propiedad-generador.component';
import { CommonModule } from '@angular/common';
import { BtnInicioComponent } from "../../components/btn-inicio/btn-inicio.component";

@Component({
  selector: 'app-propiedades-usuario',
  standalone: true,
  imports: [PropiedadGeneradorComponent, CommonModule, BtnInicioComponent],
  templateUrl: './propiedades-usuario.component.html',
  styleUrl: './propiedades-usuario.component.scss'
})
export class PropiedadesUsuarioComponent {
  private service = inject(PropiedadService);
  protected id: string | null = '';
  public rows: IPropiedad[][] = [];
  public propiedadList: IPropiedad[] = [];

  constructor(private route: ActivatedRoute){
    this.id = this.route.snapshot.paramMap.get('id');

    const userId = parseInt(this.id ?? '0', 10);
    if (userId) {
      this.service.getByUserIdSignal(userId);
      effect(() => {
        this.rows = [];
        this.propiedadList = [];
        this.propiedadList = this.service.userPropiedades$();
        this.splitPropiedadesIntoRows();
      })
    } else {
      console.error('El ID no es un número o el usuario no existe');
    }
  }

  splitPropiedadesIntoRows() {
    for(let i = 0; i < this.propiedadList.length; i += 3) {
      this.rows.push(this.propiedadList.slice(i, i + 3));
    }
  }

  volverPerfil() {
    window.location.assign('/app/perfil/' + this.id);
  }
}
