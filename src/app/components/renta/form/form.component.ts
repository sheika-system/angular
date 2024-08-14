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
  currentUserRole!: string;
  @Input() fechaFinFormatted!: string;
  @Input() fechaInicioFormatted!: string;
  updateStatus!: boolean;
  errorStatus!: boolean;

  ngOnInit(): void {
    let user = localStorage.getItem('auth_user');

    if(user) {
      this.currentUserId = parseInt(JSON.parse(user).id);
      this.currentUserRole = String(JSON.parse(user).role.name);
    }
    if(this.renta.fechaFin && this.renta.fechaInicio) {
      const fechaInicio = new Date(this.renta.fechaInicio);
      const fechaFin = new Date(this.renta.fechaFin);

      this.fechaInicioFormatted = this.formatDate(fechaInicio);
      this.fechaFinFormatted = this.formatDate(fechaFin);
    }

    this.estados = this.estados.filter(estado => estado !== this.renta.estado);
  }

  onSubmit(form: NgForm, modal: any) {
    this.renta.fechaFin = form.value.fechaFin;
    this.renta.fechaInicio = form.value.fechaInicio;

    delete this.renta.user?.authorities;
    delete this.renta.propiedad?.user?.authorities;

    console.log(this.renta);

    this.service.updateRentaSignal(this.renta).subscribe({
      next: () => {
        this.updateStatus = true;
        setTimeout(() => {
          this.updateStatus = false;
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

  formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
  
    return `${year}-${month}-${day}`;
  };
  
}
