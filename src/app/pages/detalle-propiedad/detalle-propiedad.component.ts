import { Component, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropiedadService } from '../../services/propiedad.service';
import { IPropiedad, IImagen, IRenta } from '../../interfaces';
import { ImagenComponent } from '../../components/imagen/imagen.component';
import { ImagenModalComponent } from '../../components/imagen/imagen-modal/imagen-modal.component';
import { CommonModule } from '@angular/common';
import { BtnInicioComponent } from '../../components/btn-inicio/btn-inicio.component';
import { ModalComponent } from "../../components/modal/modal.component";
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors, ReactiveFormsModule, FormsModule, NgForm} from '@angular/forms';
import { RentaService } from '../../services/renta.service';

@Component({
  selector: 'app-propiedad',
  standalone: true,
  imports: [
    ImagenComponent,
    ImagenModalComponent,
    CommonModule,
    BtnInicioComponent,
    ModalComponent,
    ReactiveFormsModule,
    FormsModule],
  templateUrl: './detalle-propiedad.component.html',
  styleUrl: './detalle-propiedad.component.scss'
})
export class PropiedadDetalleComponent implements OnInit{
  rentaForm!: FormGroup;
  userId!: number;
  propiedadId: number;
  listaImagenes: IImagen[] = [];
  propiedad: IPropiedad = {
    listaImagenes: this.listaImagenes
  };
  renta: IRenta = {
    estado: 'pendiente'
  }
  formSuccess: boolean = false;
  formFailure: boolean = false;
  errorMessage!: string
  private service = inject(PropiedadService);
  private rentaService = inject(RentaService);

  constructor(private route: ActivatedRoute, private fb: FormBuilder, private router: Router) {
    this.propiedadId = parseInt(this.route.snapshot.paramMap.get('id') ?? '0', 10);
    let user = localStorage.getItem('auth_user');

    if(user) {
      this.userId = parseInt(JSON.parse(user).id);
    }

    try {
      this.service.getByIdSignal(this.propiedadId);
      effect(() => {
        this.propiedad = this.service.propiedad$();
      })
    } catch(error) {
      console.error("El id no está en un formato correcto o no existe: " + error);
    }
  }

  ngOnInit(): void {
      this.rentaForm = this.fb.group({
        fechaInicio: ['', Validators.required],
        fechaFin: ['', Validators.required],
        estado: ['pendiente'],
        comentario: [''],
        user: [{
          id: this.userId
        }],
        propiedad: [{
          propiedadId: this.propiedadId
        }]
      }, { validators: this.dateRangeValidator });
  }

  dateRangeValidator(control: AbstractControl): ValidationErrors | null{
    const fechaInicio = new Date(control.get('fechaInicio')?.value).setHours(0, 0, 0, 0);
    const fechaFin = new Date(control.get('fechaFin')?.value).setHours(0, 0, 0, 0);
    const today = new Date().setHours(0, 0, 0, 0);

    if (fechaInicio && fechaFin && new Date(fechaFin) <= new Date(fechaInicio)) {
      return { dateRangeInvalid: true };
    }

    if (fechaInicio && fechaFin && fechaInicio < today || fechaFin < today) {
      return { dateNotAfterToday: true };
    }

    return null;
  }

  onSubmit(modal: any): void {
    if (this.rentaForm.valid) {
      this.renta = this.rentaForm.value;
      this.rentaService.saveRentaSignal(this.renta).subscribe({
        next: () => {
          this.formSuccess = true;
          setTimeout(() => {
            this.router.navigateByUrl('/app/rentas');
            modal.hide();
          }, 1000);
        },
        error: (error: any) => {
          this.formFailure = true;
          this.errorMessage = error.message;
        }
      });
    }
  }

  showModal(modal: any) {
    modal.show()
  }
}
