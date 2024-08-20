import { AfterViewInit, Component, effect, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../../services/user.service';
import { IUser } from '../../../interfaces';
import { ModalComponent } from '../../modal/modal.component';
import { UserFormComponent } from '../user-from/user-form.component';
import { PerfilFormComponent } from '../../perfil/perfil-form/perfil-form.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-user-list',
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
    PerfilFormComponent
  ],
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements AfterViewInit {
  public search: string = '';
  public userList: MatTableDataSource<IUser> = new MatTableDataSource<IUser>([]);
  private service = inject(UserService);
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

  userToModify: IUser = {};

  columnsToDisplay = ['id', 'nombre', 'apellido', 'email', 'rol', 'createdAt', 'updatedAt', 'acciones'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    this.service.getAllSignal();
    effect(() => {
      const users = this.service.users$();
      this.userList.data = users;
      if (this.userList.paginator) {
        this.userList.paginator.firstPage();
      }

      let user = localStorage.getItem('auth_user');
      if(user) {
        this.currentUserId = JSON.parse(user)?.id;
        console.log(this.currentUserId);
      }
    });
  }

  ngAfterViewInit() {
    this.userList.paginator = this.paginator;
    this.userList.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.userList.filter = filterValue.trim().toLowerCase();

    if (this.userList.paginator) {
      this.userList.paginator.firstPage();
    }
  }

  showEdit(user: IUser, modal: any) {
    this.userToModify = { ...user }; 
    modal.show();
  }

  showDelete(user: IUser, modal: any) {
    this.userToModify = { ...user };
    modal.show()
  }

  deleteUser(userId: number | undefined) {
    if(userId) {
      this.service.deleteUserSignal(userId).subscribe({
        next: () => {
          this.successStatus = true;
          this.successMessage = 'Usuario borrado';
          setTimeout(function(){
            location.reload();
          }, 1000);
        },
        error: (error: any) => {
          this.snackBar.open('Error Borrando usuario', 'Close', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            panelClass: ['error-snackbar']
          });
        }
      });
    }
  }
}
