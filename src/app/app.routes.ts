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


export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
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
    path: '',
    redirectTo: 'login',
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

        path: 'propiedad',
        component: PropiedadComponent,
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
            IRole.admin, 
            IRole.superAdmin,
            IRole.user
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
      }
    ],
  },
];
