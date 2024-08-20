import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IImagen, IPropiedad, IResponse } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenService extends BaseService<IImagen>{

  protected override source: string = 'imagenes';
  // private imagenListSignal = signal<IImagen[]>([]);
  private imagenesPropiedad = signal<IImagen[]>([]);

  // get imagenes$() {
  //   return this.imagenListSignal;
  // }

  get imagenesPropiedad$() {
    // console.log(this.imagenesPropiedad);
    return this.imagenesPropiedad;
  }

  getAllSignal(propiedadId: any) {
    this.http.get(`${this.source}/propiedad/${propiedadId}`).subscribe({
      next: (response: any) => {
        this.imagenesPropiedad.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching imagenes', error);
      }
    });
  }

  saveUbicacionSignal (ubicacion: IImagen): Observable<any>{
    return this.add(ubicacion).pipe(
      tap((response: any) => {
        this.imagenesPropiedad.update( ubicaciones => [response, ...ubicaciones]);
      }),
      catchError(error => {
        console.error('Error saving imagenes', error);
        return throwError(error);
      })
    );
  }
}
