import { ChangeDetectorRef, Component, effect, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { IRenta, ITipoPropiedad, IUbicacion } from '../../interfaces';
import { RentaService } from '../../services/renta.service';
import { ItemComponent } from "../../components/renta/item/item.component";
import { CommonModule, NgFor } from '@angular/common';
import { LoaderComponent } from "../../components/loader/loader.component";
import { TipoPropiedadService } from '../../services/tipo-propiedad.service';
import { UbicacionSelectorComponent } from "../../components/ubicacion/ubicacion-selector/ubicacion-selector.component";
import { UbicacionService } from '../../services/ubicacion.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rentas',
  standalone: true,
  imports: [
    ItemComponent,
    CommonModule,
    LoaderComponent,
    UbicacionSelectorComponent,
    FormsModule
],
  templateUrl: './rentas.component.html',
  styleUrl: './rentas.component.scss'
})
export class RentasComponent{
  tiposDePropiedad!: ITipoPropiedad[];
  currentUserId!: string;
  rentasEnviadas: IRenta[] = [{}];
  rentasRecibidas: IRenta[] = [{}];
  rentasActivas: IRenta[] = [{}];
  rentasCompletas: IRenta[] = [{}];
  private service = inject(RentaService);
  private tipoPropiedadService = inject(TipoPropiedadService);
  ubicacionService = inject(UbicacionService);

  selectedTipoPropiedad: string = '';
  ubicacionFilters = {
    provincia: '',
    canton: '',
    distrito: ''
  }

  @Output() filtersChanged = new EventEmitter<any>();

  constructor(private cdr: ChangeDetectorRef) {
    let user = localStorage.getItem('auth_user');

    if(user) {
      this.currentUserId = String(JSON.parse(user).id);
      this.getRentas(this.currentUserId);
      this.getTiposDePropiedad();
      this.ubicacionService.getProvincias();
      this.ubicacionService.getCantones();
      this.ubicacionService.getDistritos();
    }
  }

  getTiposDePropiedad() {
    this.tipoPropiedadService.getAllSignal();
    effect(() => {
      this.tiposDePropiedad = this.tipoPropiedadService.tipoPropiedades$();
    });
  }

  getRentas(userId: string) {
    this.service.getAllRecibidasSignal(this.currentUserId);
    this.service.getAllEnviadasSignal(this.currentUserId);
    this.service.getAllActivasSignal(this.currentUserId);
    this.service.getAllCompletasSignal(this.currentUserId);
    
    effect(() => {
      this.rentasRecibidas = this.service.rentasRecibidas$();
      this.rentasEnviadas = this.service.rentasEnviadas$();
      this.rentasActivas = this.service.rentasActivas$();
      this.rentasCompletas = this.service.rentasCompletas$();
      this.filterRentasTipoPropiedad();
    });
  }
  

  filterRentasTipoPropiedad() {
    if (this.selectedTipoPropiedad === '') {
      this.rentasEnviadas = this.service.rentasEnviadas$();
      this.rentasRecibidas = this.service.rentasRecibidas$();
      this.rentasActivas = this.service.rentasActivas$();
      this.rentasCompletas = this.service.rentasCompletas$();
    } else {
      this.rentasEnviadas = this.service.rentasEnviadas$().filter(renta => renta.propiedad?.tipoPropiedad?.nombre === this.selectedTipoPropiedad);
      this.rentasRecibidas = this.service.rentasRecibidas$().filter(renta => renta.propiedad?.tipoPropiedad?.nombre === this.selectedTipoPropiedad);
      this.rentasActivas = this.service.rentasActivas$().filter(renta => renta.propiedad?.tipoPropiedad?.nombre === this.selectedTipoPropiedad);
      this.rentasCompletas = this.service.rentasCompletas$().filter(renta => renta.propiedad?.tipoPropiedad?.nombre === this.selectedTipoPropiedad);
    }
  }

  onUbicacionChangeEnviadas(ubicacion: IUbicacion) {
    if(ubicacion.provincia?.nombre) {
      this.rentasEnviadas = this.service.rentasEnviadas$().filter(renta => renta.propiedad?.ubicacion?.provincia?.nombre === ubicacion.provincia?.nombre);
      
      if(ubicacion.canton?.nombre) {
        this.rentasEnviadas = this.service.rentasEnviadas$().filter(renta => renta.propiedad?.ubicacion?.canton?.nombre === ubicacion.canton?.nombre);
      
        if(ubicacion.distrito?.nombre) {
          this.rentasEnviadas = this.service.rentasEnviadas$().filter(renta => renta.propiedad?.ubicacion?.distrito?.nombre === ubicacion.distrito?.nombre);
        }
      }
    }
  }

  onUbicacionChangeRecibidas(ubicacion: IUbicacion) {
    if(ubicacion.provincia?.nombre) {
      this.rentasRecibidas = this.service.rentasRecibidas$().filter(renta => renta.propiedad?.ubicacion?.provincia?.nombre === ubicacion.provincia?.nombre);
      
      if(ubicacion.canton?.nombre) {
        this.rentasRecibidas = this.service.rentasRecibidas$().filter(renta => renta.propiedad?.ubicacion?.canton?.nombre === ubicacion.canton?.nombre);
      
        if(ubicacion.distrito?.nombre) {
          this.rentasRecibidas = this.service.rentasRecibidas$().filter(renta => renta.propiedad?.ubicacion?.distrito?.nombre === ubicacion.distrito?.nombre);
        }
      }
    }
  }

  onUbicacionChangeActivas(ubicacion: IUbicacion) {
    if(ubicacion.provincia?.nombre) {
      this.rentasActivas = this.service.rentasActivas$().filter(renta => renta.propiedad?.ubicacion?.provincia?.nombre === ubicacion.provincia?.nombre);
      
      if(ubicacion.canton?.nombre) {
        this.rentasActivas = this.service.rentasActivas$().filter(renta => renta.propiedad?.ubicacion?.canton?.nombre === ubicacion.canton?.nombre);
      
        if(ubicacion.distrito?.nombre) {
          this.rentasActivas = this.service.rentasActivas$().filter(renta => renta.propiedad?.ubicacion?.distrito?.nombre === ubicacion.distrito?.nombre);
        }
      }
    }
  }

  onUbicacionChangeCompletas(ubicacion: IUbicacion) {
    if(ubicacion.provincia?.nombre) {
      this.rentasCompletas = this.service.rentasCompletas$().filter(renta => renta.propiedad?.ubicacion?.provincia?.nombre === ubicacion.provincia?.nombre);
      
      if(ubicacion.canton?.nombre) {
        this.rentasCompletas = this.service.rentasCompletas$().filter(renta => renta.propiedad?.ubicacion?.canton?.nombre === ubicacion.canton?.nombre);
      
        if(ubicacion.distrito?.nombre) {
          this.rentasCompletas = this.service.rentasCompletas$().filter(renta => renta.propiedad?.ubicacion?.distrito?.nombre === ubicacion.distrito?.nombre);
        }
      }
    }
  }
  
  resetFilters() {
    this.selectedTipoPropiedad = '';
    this.rentasEnviadas = this.service.rentasEnviadas$();
    this.rentasRecibidas = this.service.rentasRecibidas$();
    this.rentasActivas = this.service.rentasActivas$();
    this.rentasCompletas = this.service.rentasCompletas$();
  }

  filterUbicacion() {
    this.filtersChanged.emit(this.ubicacionFilters);
  }
}
