import { Component, inject, Input, OnInit } from '@angular/core';
import { IRenta } from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { ModalComponent } from "../../modal/modal.component";
import { RentaService } from '../../../services/renta.service';
import { Router } from '@angular/router';
import { FormComponent } from "../form/form.component";

@Component({
  selector: 'app-renta-item',
  standalone: true,
  imports: [CommonModule, ModalComponent, FormComponent],
  templateUrl: './item.component.html',
  styleUrl: './item.component.scss'
})
export class ItemComponent implements OnInit {
  @Input() renta!: IRenta;
  @Input() tipo!: string;
  private service = inject(RentaService);
  editStatus!: boolean;
  editError!: boolean;

  constructor(private router: Router) {}

  ngOnInit(): void {}

  updateEstado(renta: IRenta, estado: string, modal: any) {
    renta.estado = estado;
    delete renta.user?.authorities;
    delete renta.propiedad?.user?.authorities;

    this.service.updateRentaSignal(renta).subscribe({
      next: () => {
        this.editStatus = true;
        setTimeout(() => {
          modal.hide();
          window.location.reload();
        }, 1000);
      },
      error: (error: any) => {
        this.editError = true;
      }
    });
  }

  verDetalle(modal: any) {
    modal.show();
  }

  showConfirm(event: Event, modal: any) {
    event.stopPropagation();
    modal.show();
  }

  navigate(event: Event) {
    event.stopPropagation();
  }
}
