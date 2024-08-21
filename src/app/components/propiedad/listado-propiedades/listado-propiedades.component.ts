// import { CommonModule } from '@angular/common';
// import { AfterViewInit, Component, inject } from '@angular/core';
// import { FormsModule } from '@angular/forms';
// import { ModalComponent } from '../../modal/modal.component';
// import { UserFormComponent } from '../../user/user-from/user-form.component';
// import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
// import { MatTable, MatTableDataSource } from '@angular/material/table';
// import { MatPaginator } from '@angular/material/paginator';
// import { MatSortModule } from '@angular/material/sort';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatIcon } from '@angular/material/icon';
// import { IPropiedad, IUser } from '../../../interfaces';
// import { PropiedadService } from '../../../services/propiedad.service';

// @Component({
//   selector: 'app-listado-propiedades',
//   standalone: true,
//   imports: [CommonModule,
//     FormsModule,
//     ModalComponent,
//     UserFormComponent,
//     MatSnackBarModule,
//     MatTable,
//     MatPaginator,
//     MatSortModule,
//     MatFormFieldModule,
//     MatInputModule,
//     MatIcon
//   ],
//   templateUrl: './listado-propiedades.component.html',
//   styleUrl: './listado-propiedades.component.scss'
// })
// export class ListadoPropiedadesComponent implements AfterViewInit {
//   public search: string = '';
//   public propiedadList: MatTableDataSource<IPropiedad> = new MatTableDataSource<IPropiedad>([]);
//   private service = inject(PropiedadService);
//   private snackBar = inject(MatSnackBar);
//   successStatus: boolean = false;
//   seccessMessage!: string;
//   currentUserId: number = 0;
//   public currentUser: IUser = {
//     id: 0,
//     nombre: '',
//     apellido: '',
//     email: '',
//     password: '',
//     createdAt: '',
//     updatedAt: '',
//     authorities: [],
//     ubicacion: {
//       ubicacionId: 0
//     },
//     photo: null as any
//   };

//   propiedadToModify: IPropiedad = {};

//   columnsToDisplay = ['propiedadId', 'nombre', 'descripcion', 'tipoPropiedad', 'moneda', 'precio', '']
// }
