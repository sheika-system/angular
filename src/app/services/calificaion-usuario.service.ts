import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ICalificacionUsuario } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CalificacionUsuarioService extends BaseService<ICalificacionUsuario> {
  protected override source: string = 'calificacionUsuario';
  protected baseUrl: string = 'http://localhost:4200';
  private calificacionUsuarioListSignal = signal<ICalificacionUsuario[]>([]);
  private calificacionUsuarioSignal = signal<ICalificacionUsuario>({});
  
  get calificaciones$() {
    return this.calificacionUsuarioListSignal;
  }

  get calificacion$() {
    return this.calificacionUsuarioSignal;
  }
  
  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.calificacionUsuarioListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching calificaciones', error);
      }
    });
  }

  getByIdSignal(id: number) {
    this.find(id).subscribe({
      next: (response: any) => {
        this.calificacionUsuarioSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching calificacion', error);
      }
    });
  }
  
  saveCalificacionUsuarioSignal(calificacionUsuario: ICalificacionUsuario): Observable<any> {
    return this.add(calificacionUsuario).pipe(
      tap((response: any) => {
        this.calificacionUsuarioListSignal.update(calificaciones => [response, ...calificaciones]);
      }),
      catchError(error => {
        console.error('Error saving calificacion', error);
        return throwError(error);
      })
    );
  }
  
  updateCalificacionUsuarioSignal(calificacionUsuario: ICalificacionUsuario): Observable<any> {
    return this.edit(calificacionUsuario.id, calificacionUsuario).pipe(
      tap((response: any) => {
        const updatedCalificaciones = this.calificacionUsuarioListSignal().map(c => c.id === calificacionUsuario.id ? response : c);
        this.calificacionUsuarioListSignal.set(updatedCalificaciones);
      }),
      catchError(error => {
        console.error('Error updating calificacion', error);
        return throwError(error);
      })
    );
  }
  
  deleteCalificacionUsuarioSignal(calificacionUsuario: ICalificacionUsuario): Observable<any> {
    return this.del(calificacionUsuario.id).pipe(
      tap((response: any) => {
        const updatedCalificaciones = this.calificacionUsuarioListSignal().filter(c => c.id !== calificacionUsuario.id);
        this.calificacionUsuarioListSignal.set(updatedCalificaciones);
      }),
      catchError(error => {
        console.error('Error deleting calificacion', error);
        return throwError(error);
      })
    );
  }

  getByUsuarioCalificadoId(usuarioCalificadoId: number): Observable<ICalificacionUsuario[]> {
    return this.http.get<ICalificacionUsuario[]>(`${this.source}/calificado/${usuarioCalificadoId}`).pipe(
      tap((response: ICalificacionUsuario[]) => {
        this.calificacionUsuarioListSignal.set(response);
      }),
      catchError(error => {
        console.error('Error fetching calificaciones by usuario calificado', error);
        return throwError(error);
      })
    );
  }

  getByUsuarioCalificadorId(usuarioCalificadorId: number) {
    return this.http.get<ICalificacionUsuario[]>(`${this.baseUrl}/${this.source}/calificador/${usuarioCalificadorId}`).pipe(
      tap((response: any) => {
        this.calificacionUsuarioListSignal.set(response);
      }),
      catchError(error => {
        console.error('Error fetching calificaciones by usuario calificador', error);
        return throwError(error);
      })
    );
  }
}