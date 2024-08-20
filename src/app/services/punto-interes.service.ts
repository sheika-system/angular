import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IPuntoInteres, IResponse } from '../interfaces';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PuntoInteresService extends BaseService<IPuntoInteres> {

  protected override source: string = 'puntointeres';
  private puntoInteresListSignal = signal<IPuntoInteres[]>([]);

  get puntoInteresList$() {
    return this.puntoInteresListSignal;
  }

  // Obtiene la lista de puntos de interes  por recorrido3d
  getPuntoInteresByRecorrido3d(recorrido3dId: number) {
    this.http.get<IResponse<IPuntoInteres[]>>(this.source + "/recorrido3D/" + recorrido3dId).subscribe({
      next: (response: any) => {
        this.puntoInteresListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching punto interes by recorrido3D', error);
      }
    });
  }

  getPuntoInteresByRecorridoAndEscena(recorrido3dId: number, escenaId: string) {
    this.http.get<IResponse<IPuntoInteres[]>>(`${this.source}/recorrido3D/${recorrido3dId}/escena/${escenaId}`).subscribe({
      next: (response: any) => {
        this.puntoInteresListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching punto interes by recorrido3D and escena', error);
      }
    });
  }

  savePuntoInteresSignal(puntoInteres: IPuntoInteres): Observable<any> {
    return this.add(puntoInteres).pipe(
      tap((response: any) => {
        this.puntoInteresListSignal.update(puntoInteresList => [response, ...puntoInteresList]);
      }),
      catchError(error => {
        console.error('Error saving punto interes', error);
        return throwError(() => error);
      })
    );
  }

  deletePuntoInteres(puntoInteres: IPuntoInteres): Observable<any> {
    return this.del(puntoInteres.puntoInteresId).pipe(
      tap((response: any) => {
        const updatedPuntoInteresList = this.puntoInteresListSignal().filter(p => p.puntoInteresId !== puntoInteres.puntoInteresId);
        this.puntoInteresListSignal.set(updatedPuntoInteresList);
      }),
      catchError(error => {
        console.error('Error deleting punto interes', error);
        return throwError(() => error);
      })
    );
  }

}