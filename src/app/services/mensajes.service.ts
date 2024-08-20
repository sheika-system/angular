import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IMensaje } from '../interfaces';
import { catchError, debounceTime, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensajesService extends BaseService<IMensaje>{
  protected override source: string = 'mensajes';
  protected baseUrl: string = 'http://localhost:4200';
  private mensajeSignal = signal<IMensaje>({});
  private mensajesListSignal = signal<IMensaje[]>([]);
  private userMensajeListSignal = signal<IMensaje[]>([]);

  saveMensaje(mensaje: IMensaje): Observable<any> {
    return this.add(mensaje).pipe(
      tap((response: any) => {
        this.mensajesListSignal.update(mensajes => [response, ...mensajes]);
      }),
      catchError(error => {
        console.error('Error saving user', error);
        return throwError(error);
      })
    );
  }

  get mensajes$() {
    return this.mensajesListSignal;
}

get mensaje$() {
    return this.mensajeSignal;
}

get userMensajes$() {
    return this.userMensajeListSignal;
}

getAllSignal() {
  this.findAll().subscribe({
      next: (response: any) => {
          response.reverse();
          if (JSON.stringify(this.mensajesListSignal()) !== JSON.stringify(response)) {
            this.mensajesListSignal.set(response);
          }
      },
      error: (error: any) => {
          console.error('Error fetching mensajes', error);
      }
  });
}

getByUserIdSignal(id: number) {
  this.http.get(`${this.source}/receptor/` + id).pipe(
    tap((response: any) => {
      if (JSON.stringify(this.mensajesListSignal()) !== JSON.stringify(response)) {
        this.mensajesListSignal.set(response);
      }
    }),
    catchError((error: any) => {
      console.error('Error fetching mensaje', error);
      return throwError(error);
    })
  ).subscribe();
}

deleteMensaje(mensaje: IMensaje) {
  return this.http.delete(`${this.source}/` + mensaje.mensajeId).pipe(
    tap(() => {
      const updatedMensaje = this.mensajesListSignal().filter(m => m.mensajeId !== mensaje.mensajeId);
      this.mensajesListSignal.set(updatedMensaje);
    }),
    catchError((error: any) => {
      console.error("Error eliminando mensaje", error);
      return throwError(error);
    })
  );
}
}
