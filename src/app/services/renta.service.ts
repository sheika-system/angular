import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IRenta, IResponse } from "../interfaces";
import { catchError, Observable, tap, throwError } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class RentaService extends BaseService<IRenta> {
    override source: string = 'rentas';
    rentaListSignal = signal<IRenta[]>([]);
    rentaRecibidaListSignal = signal<IRenta[]>([]);
    rentaEnviadaListSignal = signal<IRenta[]>([]);
    rentaActivaListSignal = signal<IRenta[]>([]);
    rentaCompletaListSignal = signal<IRenta[]>([]);

    get rentas$() {
        return this.rentaListSignal;
    }

    get rentasRecibidas$() {
        return this.rentaRecibidaListSignal;
    }

    get rentasEnviadas$() {
        return this.rentaEnviadaListSignal;
    }

    get rentasActivas$() {
        return this.rentaActivaListSignal;
    }

    get rentasCompletas$() {
        return this.rentaCompletaListSignal;
    }

    getAllSignal() {
        this.findAll().subscribe({
            next: (response: any) => {
                response.reverse();
                this.rentaListSignal.set(response);
            },
            error: (error: any) => {
                console.error('Error fetching rentas', error);
            }
        });
    }

    getAllRecibidasSignal(userId: string) {
        this.http.get<IResponse<IRenta[]>>(this.source + '/rentasRecibidas/usuario/' + userId).subscribe({
            next: (response: any) => {
                this.rentaRecibidaListSignal.set(response);
            },
            error: (error: any) => {
                return throwError(error);
            }
        });
    }

    getAllEnviadasSignal(userId: string) {
        this.http.get<IResponse<IRenta[]>>(this.source + '/rentasEnviadas/usuario/' + userId).subscribe({
            next: (response: any) => {
                this.rentaEnviadaListSignal.set(response);
            },
            error: (error: any) => {
                return throwError(error);
            }
        });
    }

    getAllActivasSignal(userId: string) {
        this.http.get<IResponse<IRenta[]>>(this.source + '/rentasActivas/usuario/' + userId).subscribe({
            next: (response: any) => {
                this.rentaActivaListSignal.set(response);
            },
            error: (error: any) => {
                return throwError(error);
            }
        });
    }

    getAllCompletasSignal(userId: string) {
        this.http.get<IResponse<IRenta[]>>(this.source + '/rentasCompletas/usuario/' + userId).subscribe({
            next: (response: any) => {
                this.rentaCompletaListSignal.set(response);
            },
            error: (error: any) => {
                return throwError(error);
            }
        });
    }

    saveRentaSignal(renta: IRenta): Observable<any>{
        return this.add(renta).pipe(
            tap((response: any) => {
                this.rentaListSignal.update( rentas => [response, ...rentas]);
            }),
            catchError(error => {
                console.error('Error guardando categoria', error);
                return throwError(error);
            })
        );
    }

    updateRentaSignal(renta: IRenta): Observable<any> {
        return this.edit(renta.rentaId, renta).pipe(
            tap((response: any) => {
                const updatedRentas = this.rentaListSignal().map(r => r.rentaId === renta.rentaId ? response : r);
                this.rentaListSignal.set(updatedRentas);
            }),
            catchError(error => {
                console.error('Error actualizando renta', error);
                return throwError(error);
            })
        );
    }

    deleteRentaSignal(rentaId: number): Observable<any> {
        return this.del(rentaId).pipe(
            tap((response: any) => {
                const updatedRentas = this.rentaListSignal().filter(r => r.rentaId !== rentaId);
                this.rentaListSignal.set(updatedRentas);
            }),
            catchError(error => {
                console.error('Error borrando renta', error);
                return throwError(error);
            })
        );
    }
}