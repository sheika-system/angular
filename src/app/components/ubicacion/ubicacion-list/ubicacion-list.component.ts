import { Component, effect, inject, Input } from '@angular/core';
import { UbicacionFormComponent } from '../ubicacion-form/ubicacion-form.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../modal/modal.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UbicacionService } from '../../../services/ubicacion.service';
import { IUbicacion, IProvincia, ICanton, IDistrito } from '../../../interfaces';

@Component({
  selector: 'app-ubicacion-list',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ModalComponent,
    UbicacionFormComponent,
    MatSnackBarModule
  ],
  templateUrl: './ubicacion-list.component.html',
  styleUrl: './ubicacion-list.component.scss'
})
export class UbicacionListComponent {

  public search: String = '';
  public service = inject(UbicacionService);
  private snackBar = inject(MatSnackBar);
  public currentUbicacion: IUbicacion = {
    direccion: "",
    latitud: 0,
    longitud: 0,
    provincia: undefined,
    canton: undefined,
    distrito: undefined
  };
  @Input() ubicacionList: IUbicacion[] = []
  @Input() provincias: IProvincia[] = []
  @Input() cantones: ICanton[] = [];
  @Input() distritos: IDistrito[] = [];

  constructor() {
    // this.service.getAllSignal();
    // effect(() => {
    //   this.ubicacionList = this.service.ubicaciones$();
    // });
  }

  showDetail(ubicacion: IUbicacion, modal: any) {
    this.currentUbicacion = {...ubicacion}; 
    modal.show();
  }

  deleteUbicacion(ubicacion: IUbicacion) {
    this.service.deleteUbicacionSignal(ubicacion).subscribe({
      next: () => {
        this.snackBar.open('Ubicacion deleted', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
      },
      error: (error: any) => {
        this.snackBar.open('Error deleting ubicacion', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }

  
}
