import { Component, effect, inject } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { PropiedadGeneradorComponent } from '../../components/lista-propiedad/propiedad-generador/propiedad-generador.component';
import { IPropiedad } from '../../interfaces';
import { PropiedadService } from '../../services/propiedad.service';
import { FiltersComponent } from '../../components/filters/filters.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AppLayoutComponent } from "../../components/app-layout/app-layout.component";
import { LoaderComponent } from '../../components/loader/loader.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [PropiedadGeneradorComponent, AppLayoutComponent, LoaderComponent, CommonModule, FiltersComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class PropiedadesListComponent {
  private service = inject(PropiedadService);
  private cdr = inject(ChangeDetectorRef);
  public rows: IPropiedad[][] = [];
  public propiedadList: IPropiedad[] = [];
  public filteredList: IPropiedad[] = [];

  constructor() {
    let promise = new Promise(() => {
      this.service.getAllSignal();
      effect(() => {
        this.rows = [];
        this.propiedadList = [];
        this.propiedadList = this.service.propiedades$();
        this.splitPropiedadesIntoRows();
      });
    });
  }
  
  splitPropiedadesIntoRows(propiedadList: IPropiedad[] = this.propiedadList) {
   
    this.rows = []; // Reinicia el arreglo de filas
    
    for (let i = 0; i < propiedadList.length; i += 3) {
      this.rows.push(propiedadList.slice(i, i + 3));
      
    }
    this.cdr.detectChanges();
  }


  onFiltersChanged(filters: any) {
    this.applyFilters(filters);
  }

  applyFilters(filters: any = null) {
    if (!filters) {
      this.filteredList = this.propiedadList;
    } else {
      this.filteredList = this.propiedadList.filter(propiedad => {
        const matchesdisponivilidad = propiedad.disponibilidad === true; 
        const matchesPriceRange =propiedad.precio !== undefined && propiedad.precio >= filters.priceRange[0] && propiedad.precio <= filters.priceRange[1];
        const matchesPropertyType = !filters.propertyType || (propiedad.tipoPropiedad && propiedad.tipoPropiedad.nombre === filters.propertyType);
        const matchesProvincia = !filters.provincia || (propiedad.ubicacion?.provincia?.nombre === filters.provincia);
        const matchesCanton = !filters.canton || (propiedad.ubicacion?.canton?.nombre === filters.canton);
        const matchesDistrito = !filters.distrito || (propiedad.ubicacion?.distrito?.nombre === filters.distrito);
        
        const matchesAmenities = !filters.amenities.length || (
          propiedad.amenidades && filters.amenities.every((amenity: string) => propiedad.amenidades!.some(propAmenidad => propAmenidad.nombre === amenity))
        );
        
        const matchesAreaRange = propiedad.metrosCuadrados !== undefined && propiedad.metrosCuadrados >= filters.areaRange[0] && propiedad.metrosCuadrados <= filters.areaRange[1];
        
        return matchesPriceRange && matchesPropertyType   && matchesProvincia && matchesCanton && matchesDistrito && matchesAmenities && matchesAreaRange && matchesdisponivilidad;
      });
    }
    
    this.splitPropiedadesIntoRows(this.filteredList);
  }
}