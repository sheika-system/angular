import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ICalificacionPropiedad } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CalificacionPropiedadService extends BaseService<ICalificacionPropiedad> {
  protected override source: string = 'calificacionPropiedad';
  protected baseUrl: string = 'http://localhost:4200';
  private calificacionPropiedadListSignal = signal<ICalificacionPropiedad[]>([]);
  private calificacionPropiedadSignal = signal<ICalificacionPropiedad>({});
  
  get calificaciones$() {
    return this.calificacionPropiedadListSignal;
  }

  get calificacion$() {
    return this.calificacionPropiedadSignal;
  }
  
  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.calificacionPropiedadListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching calificaciones', error);
      }
    });
  }

  getByIdSignal(id: number) {
    this.find(id).subscribe({
      next: (response: any) => {
        this.calificacionPropiedadSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching calificacion', error);
      }
    });
  }
  
  saveCalificacionPropiedadSignal(calificacionPropiedad: ICalificacionPropiedad): Observable<any> {
    return this.add(calificacionPropiedad).pipe(
      tap((response: any) => {
        this.calificacionPropiedadListSignal.update(calificaciones => [response, ...calificaciones]);
      }),
      catchError(error => {
        console.error('Error saving calificacion', error);
        return throwError(error);
      })
    );
  }
  
  updateCalificacionPropiedadSignal(calificacionPropiedad: ICalificacionPropiedad): Observable<any> {
    return this.edit(calificacionPropiedad.id, calificacionPropiedad).pipe(
      tap((response: any) => {
        const updatedCalificaciones = this.calificacionPropiedadListSignal().map(c => c.id === calificacionPropiedad.id ? response : c);
        this.calificacionPropiedadListSignal.set(updatedCalificaciones);
      }),
      catchError(error => {
        console.error('Error updating calificacion', error);
        return throwError(error);
      })
    );
  }
  
  deleteCalificacionPropiedadSignal(calificacionPropiedad: ICalificacionPropiedad): Observable<any> {
    return this.del(calificacionPropiedad.id).pipe(
      tap((response: any) => {
        const updatedCalificaciones = this.calificacionPropiedadListSignal().filter(c => c.id !== calificacionPropiedad.id);
        this.calificacionPropiedadListSignal.set(updatedCalificaciones);
      }),
      catchError(error => {
        console.error('Error deleting calificacion', error);
        return throwError(error);
      })
    );
  }

  getByPropiedadCalificadaId(propiedadCalificadaId: number): Observable<ICalificacionPropiedad[]> {
    return this.http.get<ICalificacionPropiedad[]>(`${this.source}/propiedad/${propiedadCalificadaId}`).pipe(
      tap((response: ICalificacionPropiedad[]) => {
        this.calificacionPropiedadListSignal.set(response);
      }),
      catchError(error => {
        console.error('Error fetching calificaciones', error);
        return throwError(error);
      })
    );
}


  getByUsuarioCalificadorId(usuarioCalificadorId: number) {
    return this.http.get<ICalificacionPropiedad[]>(`${this.baseUrl}/calificacionPropiedad/calificador/${usuarioCalificadorId}`).pipe(
      tap((response: any) => {
        this.calificacionPropiedadListSignal.set(response);
      }),
      catchError(error => {
        console.error('Error fetching calificaciones by usuario calificador', error);
        return throwError(error);
      })
    );
  }
}
