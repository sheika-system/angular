import { Component, inject, Input } from '@angular/core';
import { IPropiedad } from '../../../interfaces';
import { Router, RouterLink } from '@angular/router';
import { PropiedadService } from '../../../services/propiedad.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-propiedad-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './propiedad-card.component.html',
  styleUrl: './propiedad-card.component.scss'
})
export class PropiedadCardComponent {
  @Input() propiedad!: IPropiedad;
  private service = inject(PropiedadService)
  private snackBar = inject(MatSnackBar);

  constructor(private router: Router) {}

  verDetalle(propiedadId: number | undefined){
    this.router.navigateByUrl('/app/propiedad/' + propiedadId);
  }

  contactarPropietario(propiedadId: number | undefined){
    console.log('Contactando propietario: ' + propiedadId);
  }

  deletePropiedad(propiedad: IPropiedad) {
    this.service.deletePropiedad(propiedad).subscribe({
      next: () => {
        this.snackBar.open('Propietie deleted', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          duration: 5 * 1000,
        });
      },
      error: (error: any) => {
        this.snackBar.open('Error deleting propietie', 'Close', {
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        });
      }
    })
  }
}
