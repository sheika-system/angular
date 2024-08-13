import { Component, effect, inject} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { IUbicacion, IUser } from '../../interfaces';
import { CommonModule } from '@angular/common';
import { SvgIconComponent } from '../../components/svg-icon/svg-icon.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { PerfilFormComponent } from '../../components/perfil/perfil-form/perfil-form.component';
import { BtnInicioComponent } from "../../components/btn-inicio/btn-inicio.component";
import { CalificacionUsuarioCardComponent } from "../../components/calificacion-usuario-card/calificacion-usuario-card.component";
import { CalificacionUsuarioComponent } from "../../components/calificacion-usuario/calificacion-usuario/form-calificacion-usuario/calificacion-usuario.component";

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [
    CommonModule,
    SvgIconComponent,
    ModalComponent,
    PerfilFormComponent,
    BtnInicioComponent,
    CalificacionUsuarioCardComponent,
    CalificacionUsuarioComponent
],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent {
  protected id: string | null = '';
  protected currentUserId: string = '';
  protected currentUserRole: string = '';
  private service = inject(UserService);
  protected user: IUser = {};
  protected userUbicacion: IUbicacion | undefined = {};


  constructor(private route: ActivatedRoute){
    let user = localStorage.getItem('auth_user');

    if(user) {
      this.currentUserId = String(JSON.parse(user)?.id);
      this.currentUserRole = String(JSON.parse(user)?.role.name);
    }
    this.id = this.route.snapshot.paramMap.get('id');

    const userId = parseInt(this.id ?? '0', 10);
    if (userId) {
      this.service.getByIdSignal(userId);
      effect(() => {
        this.user = this.service.user$();
      })
    } else {
      console.error('El ID no es un número o el usuario no existe');
    }
  }

  showDetail(user: IUser, modal: any) {
    user = this.user;
    modal.show();
  }

  verPropiedadesUsuario() {
    window.location.assign('/app/propiedadesUsuario/' + this.id);
  }

  calificarUsuario(modal: any) {
    modal.show();
  }
}
