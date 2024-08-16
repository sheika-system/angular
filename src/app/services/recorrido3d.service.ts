import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IRecorrido3D, IResponse } from '../interfaces';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Recorrido3dService extends BaseService<IRecorrido3D> {
  protected override source: string = 'recorrido3D';

  private recorridoListSignal = signal<IRecorrido3D[]>([]);
  private recorrido3dSignal = signal<IRecorrido3D | null>(null);
  private loadedIdSignal = signal<number | null>(null);

  get recorrido3d$(){
    return this.recorridoListSignal;
  }

  get recorrido3dRegistrado$() {
    return this.recorrido3dSignal.asReadonly();
  }

  get loadedId$() {
    return this.loadedIdSignal.asReadonly();
  }

  setRecorrido3d(recorrido3d: IRecorrido3D) {
    this.recorrido3dSignal.set(recorrido3d);
  }

  clearRecorrido3d() {
    this.recorrido3dSignal.set(null);
  }

  saveRecorrido3D(images: File[], nombre: string, descripcion: string, propiedadId: string): Observable<any> {
    const formData = new FormData();
    
    images.forEach((image) => {
      formData.append('images', image, image.name);
    });
    
    formData.append('nombre', nombre);
    formData.append('descripcion', descripcion);
    formData.append('propiedadId', propiedadId );

    return this.http.post<IResponse<IRecorrido3D>>(this.source, formData).pipe(
      tap((response: IResponse<IRecorrido3D>) => {
        this.recorridoListSignal.update(recorridos => [response.data, ...recorridos]);
      }),
      catchError(error => {
        console.error('Error saving recorrido3D', error);
        return throwError(() => new Error(error));
      })
    );
  }

  // Método para cargar inicialmente los recorridos (si es necesario)
  loadRecorridos3d() {
    return this.findAll().pipe(
      tap((response: IResponse<IRecorrido3D[]>) => {
        this.recorridoListSignal.set(response.data);
      })
    );
  }
  
  deleteRecorrido3dSignal(recorrido3d: IRecorrido3D | null): Observable<any> {
    if (!recorrido3d || typeof recorrido3d.recorrido3dId === 'undefined') {
      console.error('Intento de eliminar un recorrido3d inválido:', recorrido3d);
      return throwError(() => new Error('Recorrido3d inválido o sin ID'));
    }

    return this.del(recorrido3d.recorrido3dId).pipe(
      tap(() => {
        this.clearRecorrido3d();
      }),
      catchError(error => {
        console.error('Error deleting recorrido3d', error);
        return throwError(() => new Error(`Error al eliminar recorrido3d: ${error.message}`));
      })
    );
  }

  getByIdSignal(id: number) {
    if (this.loadedIdSignal() !== id) {
      this.http.get<IResponse<IRecorrido3D>>(this.source + "/propiedad/" + id).subscribe({
        next: (response: any) => {
          this.recorrido3dSignal.set(response[0]);
          this.loadedIdSignal.set(id);
        },
        error: (error: any) => {
          console.error('Error fetching recorrido3d', error);
        }
      });
    }
  }
  

}
