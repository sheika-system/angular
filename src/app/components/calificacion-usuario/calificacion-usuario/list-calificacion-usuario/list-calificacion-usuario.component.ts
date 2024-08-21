import { AfterViewInit, Component, effect, inject, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CalificacionUsuarioService } from '../../../../services/calificaion-usuario.service';
import { ICalificacionUsuario } from '../../../../interfaces';
import { ModalComponent } from '../../../modal/modal.component';
import { MatIcon } from '@angular/material/icon';
import { PerfilFormComponent } from '../../../perfil/perfil-form/perfil-form.component';
import { CalificacionUsuarioCardComponent } from "../../../calificacion-usuario-card/calificacion-usuario-card.component";
import { LoaderComponent } from "../../../loader/loader.component";



@Component({
  selector: 'app-list-calificacion-usuario',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ModalComponent,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    PerfilFormComponent,
    CalificacionUsuarioCardComponent,
    LoaderComponent
],
  
  templateUrl: './list-calificacion-usuario.component.html',
  styleUrls: ['./list-calificacion-usuario.component.scss']
})
export class ListCalificacionUsuarioComponent implements AfterViewInit {
  public search: string = '';
  public calificacionList: MatTableDataSource<ICalificacionUsuario> = new MatTableDataSource<ICalificacionUsuario>([]);
  private service = inject(CalificacionUsuarioService);
  private snackBar = inject(MatSnackBar);
  successStatus: boolean = false;
  successMessage!: string;
  currentCalificacionId: number = 0;
  
  calificacionToModify: ICalificacionUsuario = {};

  columnsToDisplay = ['id', 'usuarioCalificadoId', 'usuarioCalificadorId', 'valor', 'fecha', 'comentario', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.service.getAllSignal();
    effect(() => {
      const calificaciones = this.service.calificaciones$();
      this.calificacionList.data = calificaciones;
      if (this.calificacionList.paginator) {
        this.calificacionList.paginator.firstPage();
      }

      let user = localStorage.getItem('auth_user');
      if(user) {
        this.currentCalificacionId = JSON.parse(user)?.id;
        console.log(this.currentCalificacionId);
      }
    });
  }

  ngAfterViewInit() {
    this.calificacionList.paginator = this.paginator;
    this.calificacionList.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.calificacionList.filter = filterValue.trim().toLowerCase();

    if (this.calificacionList.paginator) {
      this.calificacionList.paginator.firstPage();
    }
  }

  showEdit(calificacion: ICalificacionUsuario, modal: any) {
    this.calificacionToModify = { ...calificacion }; 
    modal.show();
  }

  showDelete(calificacion: ICalificacionUsuario, modal: any) {
    this.calificacionToModify = { ...calificacion };
    modal.show();
  }

  deleteCalificacion(calificacionId: number | undefined) {
    if(calificacionId) {
      this.service.deleteCalificacionUsuarioSignal({ id: calificacionId }).subscribe({
        next: () => {
          this.successStatus = true;
          this.successMessage = 'Calificación borrada';
          setTimeout(() => {
            this.successStatus = false;
            this.service.getAllSignal(); 
          }, 1000);
        },
        error: (error: any) => {
          this.snackBar.open('Error borrando calificación', 'Close', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
