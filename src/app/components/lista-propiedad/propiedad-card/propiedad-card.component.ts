import { Component, Input } from '@angular/core';
import { IPropiedad } from '../../../interfaces';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../../modal/modal.component";

@Component({
  selector: 'app-propiedad-card',
  standalone: true,
  imports: [RouterLink, CommonModule, ModalComponent],
  templateUrl: './propiedad-card.component.html',
  styleUrl: './propiedad-card.component.scss'
})
export class PropiedadCardComponent {
  @Input() propiedad!: IPropiedad;
  user!: string | null;

  constructor(private router: Router) {
    this.user = localStorage.getItem('auth_user');
  }

  verDetalle(propiedadId: number | undefined, modal: any) {
    if(this.user) {
      this.router.navigateByUrl('/app/propiedad/' + propiedadId);
    } else {
      modal.show()
    }
  }

  contactarPropietario(propiedadId: number | undefined){
    console.log('Contactando propietario: ' + propiedadId);
  }

  goLogin(modal: any) {
    modal.hide();
    setTimeout(() => {
      this.router.navigateByUrl('login');
    }, 100);
  }
}
