import { Component, effect, inject, ViewChild } from '@angular/core';
import { IMensaje, IUser } from '../../../interfaces';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MensajesService } from '../../../services/mensajes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserFormComponent } from '../../user/user-from/user-form.component';
import { FormMensajesComponent } from "../../mensajes/form-mensajes/form-mensajes.component";
import { ModalComponent } from '../../modal/modal.component';

@Component({
  selector: 'app-list-mensajes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    UserFormComponent,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    FormMensajesComponent
],
  templateUrl: './list-mensajes.component.html',
  styleUrl: './list-mensajes.component.scss'
})
export class ListMensajesComponent {
  public mensajeList: MatTableDataSource<IMensaje> = new MatTableDataSource<IMensaje>([]);
  private service = inject(MensajesService);
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

  mensaje: IMensaje = {};

  columnsToDisplay = ['emisor', 'texto', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
propiedad: any;
id: any;

  constructor() {
    effect(() => {
      let user = localStorage.getItem('auth_user');
      if(user) {
        this.currentUserId = JSON.parse(user)?.id;
      }
      this.service.getByUserIdSignal(this.currentUserId);
      const mensaje = this.service.mensajes$();
      this.mensajeList.data = mensaje;
      if (this.mensajeList.paginator) {
        this.mensajeList.paginator.firstPage();
      }

    });
  }

  deleteMensaje(mensaje: IMensaje | undefined) {
    if(mensaje) {
      this.service.deleteMensaje(mensaje).subscribe({
        next: () => {
          this.successStatus = true;
          this.successMessage = 'mensaje borrado';
          setTimeout(function(){
            location.reload();
          }, 1000);
        },
        error: (error: any) => {
          this.snackBar.open('Error Borrando mensaje', 'Close', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }

  ngAfterViewInit() {
    this.mensajeList.paginator = this.paginator;
    this.mensajeList.sort = this.sort;
  }

  showModal(mensaje: IMensaje, modal: any) {
    this.mensaje = mensaje; 
    modal.show();
  }

  showDelete(mensaje: IMensaje, modal: any) {
    this.mensaje = mensaje;
    modal.show();
    console.log(mensaje)
  }

}
