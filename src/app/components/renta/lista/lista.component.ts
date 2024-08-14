import { AfterViewInit, ChangeDetectorRef, Component, effect, inject, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IRenta } from '../../../interfaces';
import { RentaService } from '../../../services/renta.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { LoaderComponent } from "../../loader/loader.component";
import { CommonModule } from '@angular/common';
import { MatFormField, MatInputModule } from '@angular/material/input';
import { ModalComponent } from "../../modal/modal.component";
import { FormComponent } from "../form/form.component";
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-renta-lista',
  standalone: true,
  imports: [
    LoaderComponent,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    ModalComponent,
    FormComponent,
    MatIcon,
    MatInputModule,
    MatFormField
],
  templateUrl: './lista.component.html',
  styleUrl: './lista.component.scss'
})
export class ListaComponent implements AfterViewInit {
  public search!: string;
  public rentasList: MatTableDataSource<IRenta> = new MatTableDataSource<IRenta>([]);
  private service = inject(RentaService);

  rentaToModify: IRenta = {
    rentaId: 0,
    comentario: '',
    estado: '',
    fechaCreacion: undefined,
    fechaModificacion: undefined,
    user: {
      id: 0
    },
    propiedad: {
      propiedadId: 0
    }
  };

  fechaFinFormatted!: string;
  fechaInicioFormatted!: string;

  successStatus!: boolean;
  successMessage!: string;

  columnsToDisplay = ['rentaId', 'comentario', 'estado', 'fechaInicio', 'fechaFin', 'fechaCreacion', 'fechaModificacion', 'usuario', 'propiedad', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.service.getAllSignal();
    effect(() => {
      const rentas = this.service.rentas$();
      this.rentasList.data = rentas;

      if(this.rentasList.paginator) {
        this.rentasList.paginator.firstPage();
      }
    });
  }

  ngAfterViewInit() {
    this.rentasList.paginator = this.paginator;
    this.rentasList.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.rentasList.filter = filterValue.trim().toLowerCase();

    if(this.rentasList.paginator) {
      this.rentasList.paginator.firstPage();
    }
  }

  showEdit(renta: IRenta, modal: any) {
    if(renta.fechaFin && renta.fechaInicio) {
      const fechaInicio = new Date(renta.fechaInicio);
      const fechaFin = new Date(renta.fechaFin);

      this.fechaInicioFormatted = this.formatDate(fechaInicio);
      this.fechaFinFormatted = this.formatDate(fechaFin);
    }
    console.log(renta);
    this.rentaToModify = {...renta};
    modal.show();
  }

  showDelete(renta: IRenta, modal: any) {
    this.rentaToModify = {...renta};
    modal.show();
  }

  deleteRenta(rentaId: number | undefined, modal: any) {
    if(rentaId) {
      this.service.deleteRentaSignal(rentaId).subscribe({
        next: () => {
          this.successStatus = true;
          this.successMessage = 'Renta borrada';
          setTimeout(() => {
            modal.hide()
          }, 1000);
        }
      })
    }
  }

  formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
  
    return `${year}-${month}-${day}`;
  };
}
