import { Injectable, signal } from "@angular/core";
import { BaseService } from "./base-service";
import { IPropiedad } from "../interfaces";

@Injectable({
    providedIn: 'root'
})
export class PropiedadService extends BaseService<IPropiedad> {
    protected override source: string = 'propiedades';
    private propiedadSignal = signal<IPropiedad>({});
    private propiedadListSignal = signal<IPropiedad[]>([]);

    get propiedades$() {
        return this.propiedadListSignal;
    }

    get propiedad$() {
        return this.propiedadSignal;
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
}