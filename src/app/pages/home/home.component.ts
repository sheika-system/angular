import { Component, effect, inject } from '@angular/core';
import { PropiedadGeneradorComponent } from '../../components/propiedad/propiedad-generador/propiedad-generador.component';
import { IPropiedad } from '../../interfaces';
import { PropiedadService } from '../../services/propiedad.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PropiedadGeneradorComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class PropiedadesListComponent {
  private service = inject(PropiedadService);
  public rows: IPropiedad[][] = [];
  public propiedadList: IPropiedad[] = [];

  constructor() {
    this.service.getAllSignal();
    effect(() => {
      this.rows = [];
      this.propiedadList = [];
      this.propiedadList = this.service.propiedades$();
      this.splitPropiedadesIntoRows();
    });
  }
  
  splitPropiedadesIntoRows() {
    for(let i = 0; i < this.propiedadList.length; i += 3) {
      this.rows.push(this.propiedadList.slice(i, i + 3));
    }
  }
}