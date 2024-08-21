import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { UserFormComponent } from '../../user/user-from/user-form.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { IPropiedad, IUser } from '../../../interfaces';
import { PropiedadService } from '../../../services/propiedad.service';
import { LoaderComponent } from "../../loader/loader.component";

@Component({
  selector: 'app-listado-propiedades',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ModalComponent,
    UserFormComponent,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon, LoaderComponent],
  templateUrl: './listado-propiedades.component.html',
  styleUrl: './listado-propiedades.component.scss'
})
export class ListadoPropiedadesComponent implements AfterViewInit {
  public search: string = '';
  public propiedadList: MatTableDataSource<IPropiedad> = new MatTableDataSource<IPropiedad>([]);
  private service = inject(PropiedadService);
  private snackBar = inject(MatSnackBar);
  successStatus: boolean = false;
  successMessage!: string;
  currentUserId: number = 0;
  public currentUser: IUser = {
    id: 0,
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    createdAt: '',
    updatedAt: '',
    authorities: [],
    ubicacion: {
      ubicacionId: 0
    },
    photo: null as any
  };

  propiedadToModify: IPropiedad = {};

  columnsToDisplay = ['propiedadId', 'nombre', 'descripcion', 'tipoPropiedad', 'moneda', 'precio', 'annio', 'cuartos', 'bannios', 'area', 'disponibilidad', 'propietario']

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.service.getAllSignal();
    effect(() => {
      const propiedades = this.service.propiedades$();
      this.propiedadList.data = propiedades;
      if (this.propiedadList.paginator) {
        this.propiedadList.paginator.firstPage();
      }

      let user = localStorage.getItem('auth_user');
      if(user) {
        this.currentUserId = JSON.parse(user)?.id;
      }
    });
  }

  ngAfterViewInit() {
    this.propiedadList.paginator = this.paginator;
    this.propiedadList.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.propiedadList.filter = filterValue.trim().toLowerCase();

    if (this.propiedadList.paginator) {
      this.propiedadList.paginator.firstPage();
    }
  }

  showDelete(user: IUser, modal: any) {
    this.propiedadToModify = { ...user };
    modal.show()
  }

  deletePropiedad(propiedad: IPropiedad) {
    if(propiedad) {
      this.service.deletePropiedad(propiedad).subscribe({
        next: () => {
          this.successStatus = true;
          this.successMessage = 'Propiedad borrada';
          setTimeout(() => {
            this.successStatus = false;
            location.reload();
          }, 1000);
        },
        error: (error: any) => {
          this.snackBar.open('Error Borrando propiedad', 'Close', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
