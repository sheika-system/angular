import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IDelito } from '../interfaces';
import { Observable, tap } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { PagedResponse } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class DelitoService extends BaseService<IDelito> {
  protected override source: string = 'delitos';

  private delitosListSignal = signal<IDelito[]>([]);
  private totalCountSignal = signal<number>(0);
  
  get delitos$() {
    return this.delitosListSignal;
  }

  get totalCount$() {
    return this.totalCountSignal;
  }

  getDelitosPaged(page: number, pageSize: number, filter: string = '', sortField: string = '', sortDirection: string = ''): Observable<PagedResponse<IDelito>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('pageSize', pageSize.toString());
    
    if (filter && filter.trim() !== '') {
      params = params.set('filter', filter);
    }
  
    if (sortField && sortField.trim() !== '') {
      params = params.set('sortField', sortField);
    }
  
    if (sortDirection && sortDirection.trim() !== '') {
      params = params.set('sortDirection', sortDirection);
    }
  
    return this.http.get<PagedResponse<IDelito>>(`${this.source}/paged`, { params });
  }

  // Mantén este método si aún necesitas cargar todos los delitos en algún momento
  getAllSignal(): Observable<IDelito[]> {
    return this.http.get<IDelito[]>(this.source).pipe(
      tap((response: IDelito[]) => {
        response.reverse();
        this.delitosListSignal.set(response);
      })
    );
  }
}