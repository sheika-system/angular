import { Component, effect, inject, OnInit } from '@angular/core';
import { IRenta } from '../../interfaces';
import { RentaService } from '../../services/renta.service';
import { ItemComponent } from "../../components/renta/item/item.component";
import { CommonModule, NgFor } from '@angular/common';
import { LoaderComponent } from "../../components/loader/loader.component";

@Component({
  selector: 'app-rentas',
  standalone: true,
  imports: [
    ItemComponent,
    CommonModule,
    LoaderComponent
],
  templateUrl: './rentas.component.html',
  styleUrl: './rentas.component.scss'
})
export class RentasComponent{
  currentUserId!: string;
  rentasEnviadas: IRenta[] = [{}];
  rentasRecibidas: IRenta[] = [{}];
  rentasActivas: IRenta[] = [{}];
  rentasCompletas: IRenta[] = [{}];
  private service = inject(RentaService);

  constructor() {
    let user = localStorage.getItem('auth_user');

    if(user) {
      this.currentUserId = String(JSON.parse(user).id);
      this.getRentas(this.currentUserId);
    }
  }

  getRentas(userId: string) {
    this.service.getAllRecibidasSignal(this.currentUserId);
    effect(() => {
      this.rentasRecibidas = this.service.rentasRecibidas$();
    });

    this.service.getAllEnviadasSignal(this.currentUserId);
    effect(() => {
      this.rentasEnviadas = this.service.rentasEnviadas$();
    });

    this.service.getAllActivasSignal(this.currentUserId);
    effect(() => {
      this.rentasActivas = this.service.rentasActivas$();
    });

    this.service.getAllCompletasSignal(this.currentUserId);
    effect(() => {
      this.rentasCompletas = this.service.rentasCompletas$();
    });
  }
}
