import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../services/auth.service';
import { IUser } from '../../../../interfaces';
import { LayoutService } from '../../../../services/layout.service';
import { MyAccountComponent } from '../../../my-account/my-account.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule, RouterLink, MyAccountComponent],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss'
})
export class TopbarComponent implements OnInit {
  user = localStorage.getItem('auth_user');
  userRole: string = ""; 
  userId: string = "";

  constructor(
    public router: Router,
    public layoutService: LayoutService,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    if(this.user) {
      this.userRole = String(JSON.parse(this.user).role.name);
      this.userId = String(JSON.parse(this.user).id);
    }
  }

  public logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}