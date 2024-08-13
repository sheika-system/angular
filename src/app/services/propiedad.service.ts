
import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IPropiedad, IResponse } from '../interfaces';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, tap, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class PropiedadService extends BaseService<IPropiedad> {
    protected override source: string = 'propiedades';
    private propiedadSignal = signal<IPropiedad>({});
    private propiedadListSignal = signal<IPropiedad[]>([]);
    private userPropiedadListSignal = signal<IPropiedad[]>([]);

    registrarPropiedad(propiedad: IPropiedad): Observable<IResponse<IPropiedad>> {
        return this.http.post<IResponse<IPropiedad>>(`${this.source}/registrar`, propiedad);
      }

    get propiedades$() {
        return this.propiedadListSignal;
    }

    get propiedad$() {
        return this.propiedadSignal;
    }

    get userPropiedades$() {
        return this.userPropiedadListSignal;
    }

    getAllSignal() {
        this.findAll().subscribe({
            next: (response: any) => {
                response.reverse();
                this.propiedadListSignal.set(response);
            },
            error: (error: any) => {
                console.error('Error fetching propiedades', error);
            }
        });
    }

    getByIdSignal(id: number) {
        this.find(id).subscribe({
          next: (response: any) => {
            this.propiedadSignal.set(response);
          },
          error: (error: any) => {
            console.error('Error fetching propiedad', error);
          }
        });
    }

    getByUserIdSignal(id: number) {
        this.http.get('propiedades/user/' + id).subscribe({
            next: (response: any) => {
                this.userPropiedadListSignal.set(response);
            },
            error: (error: any) => {
                console.error('Error fetching propiedad', error);
            }
        });
    }

    deletePropiedad(propiedad: IPropiedad) {
        return this.http.delete('propiedades/' + propiedad.propiedadId).pipe(
          tap(() => {
            const updatedPropiedad = this.propiedadListSignal().filter(p => p.propiedadId !== propiedad.propiedadId);
            this.propiedadListSignal.set(updatedPropiedad);
          }),
          catchError((error: any) => {
            console.error("Error eliminando propiedad", error);
            return throwError(error);
          })
        );
      }

      updatePropiedadSignal(propiedad: IPropiedad): Observable<any> {
        return this.edit(propiedad.propiedadId, propiedad).pipe(
          tap((response: any) => {
            const updatedPropiedades = this.propiedadListSignal().map(p => p.propiedadId === propiedad.propiedadId ? response : p);
            this.propiedadListSignal.set(updatedPropiedades);
          }),
          catchError(error => {
            console.error('Error updating propietie', error);
            return throwError(error);
          })
        );
      }
}

