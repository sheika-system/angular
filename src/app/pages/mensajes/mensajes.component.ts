import { Component } from '@angular/core';
import { ListMensajesComponent } from "../../components/mensaje/list-mensajes/list-mensajes.component";
import { LoaderComponent } from "../../components/loader/loader.component";

@Component({
  selector: 'app-mensajes',
  standalone: true,
  imports: [ListMensajesComponent, LoaderComponent],
  templateUrl: './mensajes.component.html',
  styleUrl: './mensajes.component.scss'
})
export class MensajesComponent {

}
