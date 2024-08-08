import { Component, effect, inject } from '@angular/core';
import { PropiedadGeneradorComponent } from '../../components/lista-propiedad/propiedad-generador/propiedad-generador.component';
import { IPropiedad } from '../../interfaces';
import { PropiedadService } from '../../services/propiedad.service';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppLayoutComponent } from "../../components/app-layout/app-layout.component";
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PropiedadGeneradorComponent, AppLayoutComponent, LoaderComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class PropiedadesListComponent {
  private service = inject(PropiedadService);
  public rows: IPropiedad[][] = [];
  public propiedadList: IPropiedad[] = [];

  constructor() {
    let promise = new Promise(() => {
      this.service.getAllSignal();
      effect(() => {
        this.rows = [];
        this.propiedadList = [];
        this.propiedadList = this.service.propiedades$();
        this.splitPropiedadesIntoRows();
      });
    });
  }
  
  splitPropiedadesIntoRows() {
    for(let i = 0; i < this.propiedadList.length; i += 3) {
      this.rows.push(this.propiedadList.slice(i, i + 3));
    }
  }
}