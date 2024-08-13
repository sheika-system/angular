import { Routes } from '@angular/router';
import { LoginComponent } from './pages/auth/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { SigUpComponent } from './pages/auth/sign-up/signup.component';
import { UsersComponent } from './pages/users/users.component';
import { AuthGuard } from './guards/auth.guard';
import { AccessDeniedComponent } from './pages/access-denied/access-denied.component';
import { AdminRoleGuard } from './guards/admin-role.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GuestGuard } from './guards/guest.guard';
import { IRole } from './interfaces';
import { UbicacionComponent } from './pages/ubicacion/ubicacion.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { PropiedadComponent } from './pages/propiedad/propiedad.component';
import { ImagenComponent } from './components/imagen/imagen.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { DelitoComponent } from './components/delito/delito.component';
import { PropiedadesListComponent } from './pages/home/home.component';
import { PropiedadDetalleComponent } from './pages/detalle-propiedad/detalle-propiedad.component';
import { PropiedadesUsuarioComponent } from './pages/propiedades-usuario/propiedades-usuario.component';
import { TokenExpiredComponent } from './pages/token-expired/token-expired.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { CalificacionUsuarioComponent } from './components/calificacion-usuario/calificacion-usuario/form-calificacion-usuario/calificacion-usuario.component';
import { ListCalificacionUsuarioComponent } from './components/calificacion-usuario/calificacion-usuario/list-calificacion-usuario/list-calificacion-usuario.component';
import { CalificacionPropiedadComponent } from './components/calificacion-propiedad/form-calificacion-propiedad/calificacion-propiedad.component';
import { ListCalificacionPropiedadComponent } from './components/calificacion-propiedad/list-calificacion-propiedad/list-calificacion-propiedad.component';



export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard]
  },
  {
    path: 'home',
    component: PropiedadesListComponent
  },
  {
    path: 'signup',
    component: SigUpComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'reset-password',
    component: ResetPasswordComponent,
    canActivate: [GuestGuard],
  },
  {
    path: 'access-denied',
    component: AccessDeniedComponent,
  },
  {
    path: 'token-expired',
    component: TokenExpiredComponent,
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'app',
    component: AppLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'app',
        redirectTo: 'users',
        pathMatch: 'full',
      },
      {
        path: 'users',
        component: UsersComponent,
        canActivate:[AdminRoleGuard],
        data: { 
          authorities: [
            IRole.admin,
            IRole.superAdmin
          ],
          name: 'Users'
        }
      },
      {
        path: 'ubicaciones',
        component: UbicacionComponent,
        canActivate:[AdminRoleGuard],
        data: { 
          authorities: [
            IRole.admin,
            IRole.superAdmin
          ],
          name: 'Ubicaciones'
        }
      },
      {
      path: 'calificacion',
        component: CalificacionUsuarioComponent, data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin
          ],
          name: 'Users'
        }
      },
      {
        path: 'listCalificacionUsuario',
        component: ListCalificacionUsuarioComponent, 
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin
          ],
          name: 'Calificaciones de Usuario'
        }
      },
      {
        path: 'calificacionPropiedad',
          component: CalificacionPropiedadComponent, data: { 
            authorities: [
              IRole.admin, 
              IRole.superAdmin
            ],
            name: 'Users'
          }
        },
        {
          path: 'listCalificacionPropiedad',
          component: ListCalificacionPropiedadComponent, 
          data: { 
            authorities: [
              IRole.admin, 
              IRole.superAdmin
            ],
            name: 'Calificaciones de Usuario'
          }
        },
      {
        path: 'delitos',
        component: DelitoComponent,
        data: { 
          authorities: [
            IRole.admin,
            IRole.superAdmin,
            IRole.user
          ],
          name: 'delitos'
        }
      },
      {

        path: 'propiedad',
        component: PropiedadComponent,
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin,
            IRole.user
          ],
          name: 'propiedad'
        }
      },
     {
        path: 'imagenes',
        component: ImagenComponent,
        canActivate:[AdminRoleGuard],
        data: { 
          authorities: [
            IRole.admin,
            IRole.superAdmin,
            IRole.user
          ],
          name: 'Imagenes'

        }
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { 
          authorities: [
            IRole.superAdmin
          ],
          name: 'Dashboard'
        }
      },
      {
        path: 'perfil/:id',
        component: PerfilComponent,
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin,
            IRole.user
          ],
          name: 'Perfil'
        }
      },
      {
        path: 'propiedad/:id',
        component: PropiedadDetalleComponent,
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin,
            IRole.user
          ],
          name: 'Propiedad'
        }
      },
      {
        path: 'propiedadesUsuario/:id',
        component: PropiedadesUsuarioComponent,
        data: { 
          authorities: [
            IRole.admin, 
            IRole.superAdmin,
            IRole.user
          ],
          name: 'PropiedadUsuario'
        }
      }
    ],
  },
  {
    path: '**',
    component: NotFoundComponent
  }
  
];
