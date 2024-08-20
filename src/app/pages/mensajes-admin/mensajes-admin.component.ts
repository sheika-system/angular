import { Component } from '@angular/core';
import { ListAdminMensajesComponent } from "../../components/mensajes/list-admin-mensajes/list-admin-mensajes.component";
import { LoaderComponent } from "../../components/loader/loader.component";

@Component({
  selector: 'app-mensajes-admin',
  standalone: true,
  imports: [ListAdminMensajesComponent, LoaderComponent],
  templateUrl: './mensajes-admin.component.html',
  styleUrl: './mensajes-admin.component.scss'
})
export class MensajesAdminComponent {

}
