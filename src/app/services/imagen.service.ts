import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IImagen, IPropiedad, IResponse } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenService extends BaseService<IImagen>{

  protected override source: string = 'imagenes';
  private imagenesPropiedad = signal<IImagen[]>([]);
  private imagenesRecorrido3d = signal<IImagen[]>([]);
  private loadedRecorrido3dId = signal<number | null>(null);

  get imagenesRecorrido3d$() {
    return this.imagenesRecorrido3d.asReadonly();
  }

  get loadedRecorrido3dId$() {
    return this.loadedRecorrido3dId.asReadonly();
  }

  get imagenesPropiedad$() {
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

  getImagenesRecorrido3dById(recorrido3dId: number) {
    this.http.get<IResponse<IImagen[]>>(`${this.source}/recorrido3D/${recorrido3dId}`).subscribe({
      next: (response: any) => {
        this.imagenesRecorrido3d.set(response);
        this.loadedRecorrido3dId.set(recorrido3dId);
      },
      error: (error: any) => {
        console.error('Error fetching imagenes recorrido3d', error);
      }
    });
}

}
