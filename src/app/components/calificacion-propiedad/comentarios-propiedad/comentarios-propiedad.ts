import { AfterViewInit, Component, effect, inject, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ModalComponent } from '../../modal/modal.component';
import { MatIcon } from '@angular/material/icon';
import { PerfilFormComponent } from '../../perfil/perfil-form/perfil-form.component';
import { CalificacionUsuarioCardComponent } from '../../calificacion-usuario-card/calificacion-usuario-card.component';
import { ICalificacionPropiedad } from '../../../interfaces';
import { CalificacionPropiedadService } from '../../../services/calificacion-propiedad.service';



@Component({
  selector: 'app-comentario-propiedad',
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
    CalificacionUsuarioCardComponent
],
  
  templateUrl: './comentarios-propiedad.html',
  styleUrls: ['./comentario-propiedad.scss']
})
export class ComentarioPropiedadComponent implements AfterViewInit {
  public search: string = '';
  public calificacionList: MatTableDataSource<ICalificacionPropiedad> = new MatTableDataSource<ICalificacionPropiedad>([]);
  private service = inject(CalificacionPropiedadService);
  private snackBar = inject(MatSnackBar);
  successStatus: boolean = false;
  successMessage!: string;
  currentCalificacionId: number = 0;
  @Input() propiedadId!: number ;
  
  calificacionToModify: ICalificacionPropiedad = {};

  columnsToDisplay = ['usuarioCalificadorId', 'comentario', 'valor'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.service.getByPropiedadCalificadaId(this.propiedadId);
    effect(() => {
      const calificaciones = this.service.calificaciones$();
      this.calificacionList.data = calificaciones;
      if (this.calificacionList.paginator) {
        this.calificacionList.paginator.firstPage();
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

  
}
