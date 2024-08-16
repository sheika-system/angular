import { Component, inject, Input, OnInit } from '@angular/core';
import { IPropiedad, IUser } from '../../../interfaces';
import { Router, RouterLink } from '@angular/router';
import { PropiedadService } from '../../../services/propiedad.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../../modal/modal.component";
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-propiedad-card',
  standalone: true,
  imports: [RouterLink, CommonModule, ModalComponent],
  templateUrl: './propiedad-card.component.html',
  styleUrl: './propiedad-card.component.scss'
})
export class PropiedadCardComponent implements OnInit {
  @Input() propiedad!: IPropiedad;
  private service = inject(PropiedadService);
  private snackBar = inject(MatSnackBar);
  private userService = inject(UserService);
  private router = inject(Router);

  user: IUser = {};
  userId: number | null = null;  // Asegúrate de que userId sea null y no undefined
  currentPage: string = '';
  successStatus: boolean = false;
  successMessage!: string;

  constructor() {}

  async ngOnInit() {
    await this.cargarDatosUsuario();
    this.currentPage = this.router.url;
  }

  async cargarDatosUsuario(): Promise<void> {
    try {
      if (this.userId !== null) {
        await this.userService.getByIdSignal(this.userId);
    
        // Accede al usuario a través de la señal después de que la promesa se resuelva
        const user = this.userService.user$();
    
        if (user && user.id !== undefined) {  // Verifica que user.id esté definido
          this.user = user;
          this.userId = user.id;  // Asigna user.id a userId
          console.log("User: ", this.user);
        } else {
          throw new Error('Usuario no encontrado o ID de usuario no está definido');
        }
      }
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
      throw error;
    }
  }

  showDelete(propiedad: IPropiedad, modal: any) {
    this.propiedad = { ...propiedad };
    modal.show();
  }
  

  verDetalle(propiedadId: number | undefined, modal: any) {
    if (this.user.id !== null) {  // Verifica que userId no sea null
      this.router.navigateByUrl('/app/propiedad/' + propiedadId);
    } else {
      modal.show();
    }
  }

  contactarPropietario(propiedadId: number | undefined) {
    console.log('Contactando propietario: ' + propiedadId);
  }

  isOwnerOrSpecificPage(): boolean {
    const ownerUserId = this.propiedad.user?.id;
    const specificPage = `/app/propiedadesUsuario/${ownerUserId !== null ? ownerUserId : ''}`;  // Manejar null

    console.log('ownerUserId:', ownerUserId); // Verificar valor del propietario
    console.log('specificPage:', specificPage); // Verificar página específica
    console.log('currentPage:', this.currentPage); // Verificar página actual

    return (this.userId === ownerUserId || this.currentPage === specificPage);
  }

  deletePropiedad(propiedad: IPropiedad) {
    this.service.deletePropiedad(propiedad).subscribe({
      next: () => {
        this.snackBar.open('Propiedad eliminada', 'Cerrar', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
        setTimeout(function(){
          location.reload();
        }, 1000);
      },
      error: (error: any) => {
        this.snackBar.open('Error al eliminar propiedad', 'Cerrar', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  goLogin(modal: any) {
    modal.hide();
    setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 100);
  }
}
