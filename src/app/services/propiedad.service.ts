import { Injectable } from '@angular/core';
import { BaseService } from './base-service';
import { IPropiedad, IResponse } from '../interfaces';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class PropiedadService extends BaseService<IPropiedad>{
  protected override source: string = 'propiedades';

  registrarPropiedad(propiedad: IPropiedad): Observable<IResponse<IPropiedad>> {
    return this.http.post<IResponse<IPropiedad>>(`${this.source}/registrar`, propiedad);
  }
}
