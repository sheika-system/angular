import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ICanton, IDistrito, IFeedBackMessage, IFeedbackStatus, IProvincia, IUbicacion } from '../../../interfaces';
import { UbicacionService } from '../../../services/ubicacion.service';

@Component({
  selector: 'app-ubicacion-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './ubicacion-form.component.html',
  styleUrl: './ubicacion-form.component.scss'
})
export class UbicacionFormComponent {
  @Input() title!: string;
  @Input() action: string = "";
  @Input() ubicacion: IUbicacion = {
    direccion: "",
    latitud: 0,
    longitud: 0,
    provincia: { provinciaId: undefined , nombre: "" },
    canton: { cantonId: undefined, nombre: "" },
    distrito: { distritoId: undefined, nombre: "" }
  };

  @Input() provincias: IProvincia[] = [];
  @Input() cantones: ICanton[] = [];
  @Input() distritos: IDistrito[] = [];

  service = inject(UbicacionService);

  feedbackMessage: IFeedBackMessage = {type: IFeedbackStatus.default, message: ''};

  cantonesFiltrados: ICanton[] = [];
  distritosFiltrados: IDistrito[] = [];
  
  provinciaTouched = false;
  cantonTouched = false;
  distritoTouched = false;

  provinciaInvalid = false;
  cantonInvalid = false;
  distritoInvalid = false;

  onProvinciaChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.ubicacion.provincia = this.provincias.find(prov => (prov.provinciaId?.toString() ?? '') === selectedId);
    this.provinciaTouched = true;
    this.provinciaInvalid = !this.ubicacion.provincia;
  }

  onCantonChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.ubicacion.canton = this.cantones.find(cant => (cant.cantonId?.toString() ?? '') === selectedId);
    this.cantonTouched = true;
    this.cantonInvalid = !this.ubicacion.canton;
  }

  onDistritoChange(event: Event) {
    const selectedId = (event.target as HTMLSelectElement).value;
    this.ubicacion.distrito = this.distritos.find(dist => (dist.distritoId?.toString() ?? '') === selectedId);
    this.distritoTouched = true;
    this.distritoInvalid = !this.ubicacion.distrito;
  }

  handleAction (form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(controlName => {
        form.controls[controlName].markAsTouched();
      });
      return;
    } else {
      this.service[ this.action == 'add' ? 'saveUbicacionSignal': 'updateUbicacionSignal'](this.ubicacion).subscribe({
        next: () => {
          this.feedbackMessage.type = IFeedbackStatus.success;
          this.feedbackMessage.message = `Ubicación exitosamente ${this.action == 'add' ? 'registrada': 'actualizada'}`
        },
        error: (error: any) => {
          this.feedbackMessage.type = IFeedbackStatus.error;
          this.feedbackMessage.message = error.message;
        }
      })
    }
  }

}
