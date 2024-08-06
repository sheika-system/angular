import { AfterViewInit, ChangeDetectorRef, Component, inject, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { IUbicacion, IDelito, PagedResponse } from '../../interfaces';
import { UbicacionService } from '../../services/ubicacion.service';
import { UbicacionSelectorComponent } from '../../components/ubicacion/ubicacion-selector/ubicacion-selector.component';
import { MapComponent } from "../../components/map/map.component";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { DelitoService } from '../../services/delito.service';
import { finalize } from 'rxjs';
import {MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import { BtnInicioComponent } from "../btn-inicio/btn-inicio.component";


@Component({
  selector: 'app-delito',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    ModalComponent,
    LoaderComponent,
    UbicacionSelectorComponent,
    MapComponent,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    BtnInicioComponent
],
  templateUrl: './delito.component.html',
  styleUrl: './delito.component.scss'
})
export class DelitoComponent implements OnInit, AfterViewInit{

  displayedColumns: string[] = ['delito', 'subDelito', 'fecha', 'hora', 'victima', 'subVictima', 'edad', 'sexo', 'nacionalidad', 'provincia', 'canton', 'distrito'];
  dataSource!: MatTableDataSource<IDelito>;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private snackBar = inject(MatSnackBar);

  service = inject(UbicacionService);
  // delitoService = inject(DelitoService)
  // private cdr = inject(ChangeDetectorRef);
  
  ubicacionMaps: IUbicacion = {
    direccion: "",
    latitud: 0,
    longitud: 0,
    provincia: { provinciaId: undefined , nombre: "" },
    canton: { cantonId: undefined, nombre: "" },
    distrito: { distritoId: undefined, nombre: "" }
  };

  mapsLocation: any = null;
  filterValue: string = '';
  filterTimeout: any;

  constructor(
    private delitoService: DelitoService,
    private cdr: ChangeDetectorRef
  ) {
    this.dataSource = new MatTableDataSource<IDelito>([]);
  }

  ngOnInit() {
    this.service.getAllSignal();
    this.service.getProvincias();
    this.service.getCantones();
    this.service.getDistritos();
    this.loadDelitos();
    this.setupCustomFilter();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ubicacionMaps']) {
      this.updateUbicacionAndFilter(this.ubicacionMaps);
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  
    // Suscribirse a los cambios de paginación y ordenamiento
    this.paginator.page.subscribe(() => this.loadDelitos());
    this.sort.sortChange.subscribe(() => {
      this.paginator.pageIndex = 0;
      this.loadDelitos();
    });
  
    // Carga inicial de datos
    this.loadDelitos();
  }

  loadDelitos() {
    this.isLoadingResults = true;
    const pageIndex = this.paginator?.pageIndex ?? 0;
    const pageSize = this.paginator?.pageSize ?? 10;
    const sortField = this.sort?.active ?? '';
    const sortDirection = this.sort?.direction ?? '';
  
    // Solo aplicar el filtro si filterValue no está vacío
    const filter = this.filterValue ? this.filterValue : '';
  
    this.delitoService.getDelitosPaged(pageIndex, pageSize, filter, sortField, sortDirection)
      .pipe(
        finalize(() => {
          this.isLoadingResults = false;
          this.cdr.detectChanges();
        })
      )
      .subscribe({
        next: (response: PagedResponse<IDelito>) => {
          this.dataSource.data = response.content;
          this.resultsLength = response.totalElements;
          
          // Actualizar el paginador
          this.paginator.length = response.totalElements;
          this.paginator.pageIndex = response.number;
          this.paginator.pageSize = response.size;
        },
        error: (error) => {
          console.error('Error loading delitos:', error);
          this.snackBar.open('Error al cargar los datos. Por favor, intente de nuevo.', 'Cerrar', {
            duration: 3000
          });
        }
      });
  }

  onMapSelectedLocation(mapInfo: any) {
    let provinciaEncontrada: any;
    let cantonEncontrado: any;
    let distritoEncontrado: any;

    if (mapInfo.markerPosition && mapInfo.selectedLocation) {
      this.ubicacionMaps = {
        ...this.ubicacionMaps,
        latitud: mapInfo.markerPosition.lat,
        longitud: mapInfo.markerPosition.lng
      };

      // Setear provincia
      if (mapInfo.selectedLocation.provincia !== '') {
        provinciaEncontrada = this.service.provincias$().find(
          p => p.nombre.toLowerCase() === mapInfo.selectedLocation.provincia.toLowerCase()
        );
        if (provinciaEncontrada) {
          this.ubicacionMaps.provincia = provinciaEncontrada;
        }
      } else {
        this.ubicacionMaps.provincia = undefined;
      }

      // Setear cantón
      if (mapInfo.selectedLocation.canton !== '') {
        cantonEncontrado = this.service.cantones$().find(
          c => c.nombre.toLowerCase() === mapInfo.selectedLocation.canton.toLowerCase() &&
              c.provincia?.provinciaId === this.ubicacionMaps.provincia?.provinciaId
        );
        if (cantonEncontrado) {
          this.ubicacionMaps.canton = cantonEncontrado;
        } else {
          this.ubicacionMaps.canton = undefined;
        }
      } else if(mapInfo.selectedLocation.canton == '' && mapInfo.selectedLocation.distrito !== ''){
        // Buscamos el distrito
        distritoEncontrado = this.service.distritos$().find(
          d => d.nombre.toLowerCase() === mapInfo.selectedLocation.distrito.toLowerCase() &&
              d.canton?.provincia?.provinciaId === provinciaEncontrada.provinciaId
        );
        // Buscamos el canton por medio del distrito
        cantonEncontrado = this.service.cantones$().find(
          c => c.cantonId === distritoEncontrado?.canton?.cantonId
        );
        if (cantonEncontrado) {
          this.ubicacionMaps.canton = cantonEncontrado;
        } else {
          this.ubicacionMaps.canton = undefined;
        }

      }else{
        this.ubicacionMaps.canton = undefined;
      }
      
      if(!distritoEncontrado){
        // Setear distrito
        if (mapInfo.selectedLocation.distrito !== '') {
          distritoEncontrado = this.service.distritos$().find(
            d => d.nombre.toLowerCase() === mapInfo.selectedLocation.distrito.toLowerCase() &&
                d.canton?.cantonId === this.ubicacionMaps.canton?.cantonId
          );
          if (distritoEncontrado) {
            this.ubicacionMaps.distrito = distritoEncontrado;
          } else {
            this.ubicacionMaps.distrito = undefined;
          }
        } else {
          this.ubicacionMaps.distrito = undefined;
        }
      }else{
        this.ubicacionMaps.distrito = distritoEncontrado;
      }
    }
    this.updateUbicacionAndFilter(this.ubicacionMaps);
  }

  onUbicacionChange(ubicacion: IUbicacion) {
    this.updateUbicacionAndFilter(ubicacion);
  }

  resetUbicacion($event: boolean) {
    if ($event) {
      // Reiniciar ubicacionMaps
      this.ubicacionMaps = {
        direccion: "",
        latitud: 0,
        longitud: 0,
        provincia: { provinciaId: undefined, nombre: "" },
        canton: { cantonId: undefined, nombre: "" },
        distrito: { distritoId: undefined, nombre: "" }
      };
  
      // Limpiar el filtro
      this.filterValue = '';
  
      // Reiniciar el paginador
      if (this.paginator) {
        this.paginator.pageIndex = 0;
      }
  
      // Limpiar cualquier entrada en el campo de búsqueda
      const inputElement = document.querySelector('input[matInput]') as HTMLInputElement;
      if (inputElement) {
        inputElement.value = '';
      }
  
      // Recargar los delitos sin filtros
      this.loadDelitos();
  
      // Opcional: Notificar al usuario
      this.snackBar.open('Filtros de ubicación reiniciados', 'Cerrar', {
        duration: 3000
      });
    }
  }

  normalizeLocation(str: string): string {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9:\s]/g, ""); // Elimina caracteres especiales excepto espacios
  }

  // applyUbicacionFilter() {
  //   const filterValue = {
  //     provincia: this.ubicacionMaps.provincia?.nombre || '',
  //     canton: this.ubicacionMaps.canton?.nombre || '',
  //     distrito: this.ubicacionMaps.distrito?.nombre || ''
  //   };
  //   console.log("filterValue", filterValue);
  //   this.dataSource.filter = JSON.stringify(filterValue);
  //   this.cdr.detectChanges();
  // }

  updateUbicacionAndFilter(newUbicacion: Partial<IUbicacion>) {
    this.ubicacionMaps = { ...this.ubicacionMaps, ...newUbicacion };
    const locationFilter = this.buildLocationFilter();
    if (locationFilter) {
      this.filterValue = this.processFilterValue(locationFilter);
      this.loadDelitos();
    }
  }
  
  setupCustomFilter() {
    this.dataSource.filterPredicate = (data: IDelito, filter: string) => {
      // Intentamos parsear el filtro como JSON (para el filtro de ubicación)
      try {
        const searchTerms = JSON.parse(filter) as {provincia?: string, canton?: string, distrito?: string};
        
        const provinciaMatch = !searchTerms.provincia || 
          this.normalizeLocation(data.provincia).includes(this.normalizeLocation(searchTerms.provincia));
        
        const cantonMatch = !searchTerms.canton || 
          this.normalizeLocation(data.canton).includes(this.normalizeLocation(searchTerms.canton));
        
        const distritoMatch = !searchTerms.distrito || 
          this.normalizeLocation(data.distrito).includes(this.normalizeLocation(searchTerms.distrito));
  
        return provinciaMatch && cantonMatch && distritoMatch;
      } catch (e) {
        // Si no es JSON, asumimos que es un filtro general
        const normalizedFilter = this.normalizeLocation(filter);
        return this.checkAllFields(data, normalizedFilter);
      }
    };
  }

  private checkAllFields(data: IDelito, normalizedFilter: string): boolean {
    return (
      this.normalizeLocation(data.delito).includes(normalizedFilter) ||
      this.normalizeLocation(data.subdelito).includes(normalizedFilter) ||
      this.normalizeLocation(data.victima).includes(normalizedFilter) ||
      this.normalizeLocation(data.subvictima).includes(normalizedFilter) ||
      this.normalizeLocation(data.sexo).includes(normalizedFilter) ||
      this.normalizeLocation(data.nacionalidad).includes(normalizedFilter) ||
      this.normalizeLocation(data.provincia).includes(normalizedFilter) ||
      this.normalizeLocation(data.canton).includes(normalizedFilter) ||
      this.normalizeLocation(data.distrito).includes(normalizedFilter)
    );
  }

  setupSorting() {
    this.dataSource.sortingDataAccessor = (item: IDelito, sortHeaderId: string) => {
      const property = sortHeaderId as keyof IDelito;
      
      switch(property) {
        case 'fecha':
          return item.fecha.getTime();
        case 'provincia':
        case 'canton':
        case 'distrito':
          return this.normalizeLocation(item[property]);
        default:
          // Asegurarse de que solo accedemos a propiedades válidas de IDelito
          if (property in item) {
            return item[property] as string;
          }
          return '';
      }
    };
  }

  applyFilter(event: Event) {
    const inputValue = this.normalizeLocation((event.target as HTMLInputElement).value);
    const locationFilter = this.buildLocationFilter();
    const combinedFilter = locationFilter ? `${locationFilter} AND ${inputValue}` : inputValue;
    this.filterValue = this.processFilterValue(combinedFilter);
    this.paginator.pageIndex = 0;
    console.log("this.filterValue", this.filterValue);
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }
    this.filterTimeout = setTimeout(() => {
      this.loadDelitos();
    }, 500);
  }
  
  private processFilterValue(value: string): string {
    const terms = value.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
    // const terms = value.match(/(?:[^\s":]+|"[^"]*")+|:/g) || [];
    console.log("terms", terms);
    const processedTerms = terms.map(term => {
      if (term.includes(':')) {
        const [field, searchValue] = term.split(':');
        return `${field.toLowerCase()}:${encodeURIComponent(this.normalizeLocation(searchValue.replace(/"/g, '')))}`;
      } else {
        return `all:${encodeURIComponent(this.normalizeLocation(term.replace(/"/g, '')))}`;
      }
    });
  
    return processedTerms.join('|');
  }

  private buildLocationFilter(): string {
    const locationFilters = [];
    if (this.ubicacionMaps.provincia?.nombre) {
      locationFilters.push(`provincia:${this.normalizeLocation(this.ubicacionMaps.provincia.nombre)}`);
    }
    if (this.ubicacionMaps.canton?.nombre) {
      locationFilters.push(`canton:${this.normalizeLocation(this.ubicacionMaps.canton.nombre)}`);
    }
    if (this.ubicacionMaps.distrito?.nombre) {
      locationFilters.push(`distrito:${this.normalizeLocation(this.ubicacionMaps.distrito.nombre)}`);
    }
    return locationFilters.join(' AND ');
  }

}
