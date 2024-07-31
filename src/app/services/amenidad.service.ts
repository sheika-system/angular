import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IAmenidad } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AmenidadService extends BaseService<IAmenidad>{

  protected override source: string = 'amenidades';
  private amenidadesList = signal<IAmenidad[]>([]);

  get amenidades$(){
    return this.amenidadesList;
  }


  getAllSignal(){
    this.http.get(this.source).subscribe({
      next: (response: any) => {
        response.reverse();
        this.amenidadesList.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching amenidades', error);
      }
    });
  }

  


}
