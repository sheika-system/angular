import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-imagen-modal',
  standalone: true,
  imports: [],
  templateUrl: './imagen-modal.component.html',
  styleUrl: './imagen-modal.component.scss'
})
export class ImagenModalComponent {

  @Input() imagenUrl: string | undefined;
  @Input() descripcion: string | undefined;

  constructor(public activeModal: NgbActiveModal) {}

  
}
