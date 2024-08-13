import { Component, inject, Input, OnInit } from '@angular/core';
import { IRenta } from '../../../interfaces';
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, NgModel, NgForm, Form } from '@angular/forms';
import { CommonModule, NgTemplateOutlet } from '@angular/common';
import { RentaService } from '../../../services/renta.service';

@Component({
  selector: 'app-renta-form',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule, FormsModule, NgTemplateOutlet],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss'
})
export class FormComponent implements OnInit{
  @Input() renta!: IRenta;
  @Input() tipo!: string;
  @Input() modal!: any;
  service = inject(RentaService);
  rentaForm!: FormGroup;
  estados: string[] = ['completa', 'pendiente', 'activa', 'cancelada'];
  currentUserId!: number;
  fechaFinFormatted!: string;
  fechaInicioFormatted!: string;
  updateStatus!: boolean;
  errorStatus!: boolean;

  ngOnInit(): void {
    let user = localStorage.getItem('auth_user');

    if(user) {
      this.currentUserId = parseInt(JSON.parse(user).id);
    }
    if(this.renta.fechaFin && this.renta.fechaInicio) {
      const fechaInicio = new Date(this.renta.fechaInicio);
      const fechaFin = new Date(this.renta.fechaFin);

      this.fechaInicioFormatted = fechaInicio.toISOString().split('T')[0];
      this.fechaFinFormatted = fechaFin.toISOString().split('T')[0];
    }

    this.estados = this.estados.filter(estado => estado !== this.renta.estado);
  }

  onSubmit(form: NgForm, modal: any) {
    this.renta.fechaFin = form.value.fechaFin;
    this.renta.fechaInicio = form.value.fechaInicio;

    delete this.renta.user?.authorities;
    delete this.renta.propiedad?.user?.authorities;

    this.service.updateRentaSignal(this.renta).subscribe({
      next: () => {
        this.updateStatus = true;
        setTimeout(() => {
          modal.hide();
          location.reload();
        }, 1000);
      },
      error: (error: any) => {
        this.errorStatus = true;
        console.error('Error guardando datos de la renta:', error.message);
      }
    });
  }
}
