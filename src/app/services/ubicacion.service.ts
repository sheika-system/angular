import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ICanton, IDistrito, IProvincia, IResponse, IUbicacion } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UbicacionService extends BaseService<IUbicacion> {

  protected override source: string = 'ubicaciones';
  private ubicacionListSignal = signal<IUbicacion[]>([]);
  private provinciaListSignal = signal<IProvincia[]>([]);
  private cantonListSignal = signal<ICanton[]>([]);
  private distritoListSignal = signal<IDistrito[]>([]);

  get ubicaciones$() {
    return this.ubicacionListSignal;
  }

  get provincias$(){
    return this.provinciaListSignal;
  }

  get cantones$(){
    return this.cantonListSignal;
  }
  
  get distritos$(){
    return this.distritoListSignal;
  }

  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.ubicacionListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching ubicaciones', error);
      }
    });
  }

  getProvincias() {
    this.http.get<IResponse<IProvincia[]>>(`${this.source}/provincias`).subscribe({
      next: (response: any) => {
        this.provinciaListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching provincias', error);
      }
    });
  }

  getCantones() {
    this.http.get<IResponse<ICanton[]>>(`${this.source}/cantones`).subscribe({
      next: (response: any) => {
        this.cantonListSignal.set(response);
        console.log("cantonListSignal service", this.cantonListSignal);
      },
      error: (error: any) => {
        console.error('Error fetching cantones', error);
      }
    });
  }

  getDistritos() {
    this.http.get<IResponse<IDistrito[]>>(`${this.source}/distritos`).subscribe({
      next: (response: any) => {
        this.distritoListSignal.set(response);
        console.log("distritoListSignal service", this.distritoListSignal);
      },
      error: (error: any) => {
        console.error('Error fetching distritos', error);
      }
    });
  }

  saveUbicacionSignal (ubicacion: IUbicacion): Observable<any>{
    return this.add(ubicacion).pipe(
      tap((response: any) => {
        this.ubicacionListSignal.update( ubicaciones => [response, ...ubicaciones]);
      }),
      catchError(error => {
        console.error('Error saving ubicacion', error);
        return throwError(error);
      })
    );
  }
  updateUbicacionSignal (ubicacion: IUbicacion): Observable<any>{
    return this.edit(ubicacion.ubicacionId, ubicacion).pipe(
      tap((response: any) => {
        const updatedUbicacion = this.ubicacionListSignal().map(u => u.ubicacionId === ubicacion.ubicacionId ? response : u);
        this.ubicacionListSignal.set(updatedUbicacion);
      }),
      catchError(error => {
        console.error('Error saving ubicacion', error);
        return throwError(error);
      })
    );
  }

  deleteUbicacionSignal (ubicacion: IUbicacion): Observable<any>{
    return this.del(ubicacion.ubicacionId).pipe(
      tap((response: any) => {
        const updatedUbicacion = this.ubicacionListSignal().filter(u => u.ubicacionId !== ubicacion.ubicacionId);
        this.ubicacionListSignal.set(updatedUbicacion);
      }),
      catchError(error => {
        console.error('Error deleting ubicacion', error);
        return throwError(error);
      })
    );
  }

}
