import { Component, Input } from '@angular/core';
import { IPropiedad } from '../../../interfaces';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-propiedad-card',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './propiedad-card.component.html',
  styleUrl: './propiedad-card.component.scss'
})
export class PropiedadCardComponent {
  @Input() propiedad!: IPropiedad;

  constructor(private router: Router) {}

  verDetalle(propiedadId: number | undefined){
    this.router.navigateByUrl('/app/propiedad/' + propiedadId);
  }

  contactarPropietario(propiedadId: number | undefined){
    console.log('Contactando propietario: ' + propiedadId);
  }
}
