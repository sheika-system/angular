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
  private recorrido3dSignal = signal<IRecorrido3D>({
    nombre: '',
    descripcion: ''
  });
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
  
  deleteRecorrido3dSignal(recorrido3d: IRecorrido3D): Observable<any> {
    return this.del(recorrido3d.recorrido3dId).pipe(
      tap((response: any) => {
        const updatedRecorridos3d = this.recorridoListSignal().filter(r => r.recorrido3dId !== recorrido3d.recorrido3dId);
        this.recorridoListSignal.set(updatedRecorridos3d);
      }),
      catchError(error => {
        console.error('Error deleting recorrido3d', error);
        return throwError(() => new Error(error));
      })
    );
  }

  // getByIdSignal(id: number) {
  //   this.http.get<IResponse<IRecorrido3D>>(this.source + "/propiedad/" + id).subscribe({
  //     next: (response: any) => {
        
  //       this.recorrido3dSignal.set(response[0]);
  //       // console.log("recorrido3dRegistrado$", this.recorrido3dRegistrado$());
  //     },
  //     error: (error: any) => {
  //       console.error('Error fetching recorrido3d', error);
  //     }
  //   });
  // }
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
