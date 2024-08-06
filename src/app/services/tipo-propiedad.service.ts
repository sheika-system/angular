import { Injectable, signal } from '@angular/core';
import { ITipoPropiedad } from '../interfaces';
import { BaseService } from './base-service';

@Injectable({
  providedIn: 'root'
})
export class TipoPropiedadService extends BaseService<ITipoPropiedad>{

  protected override source: string = 'tipo_propiedades';
  private tipoPropiedadList = signal<ITipoPropiedad[]>([]);

  get tipoPropiedades$(){
    return this.tipoPropiedadList;
  }


  getAllSignal(){
    this.http.get(this.source).subscribe({
      next: (response: any) => {
        response.reverse();
        this.tipoPropiedadList.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching tipo propiedades', error);
      }
    });
  }
}
