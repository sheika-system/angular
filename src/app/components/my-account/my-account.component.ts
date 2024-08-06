import { Component, OnInit, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthService } from "../../services/auth.service";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-my-account",
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: "./my-account.component.html",
  styleUrl: "./my-account.component.scss"
})
export class MyAccountComponent implements OnInit {
  public authUserExists: boolean = false;
  public userName: string = '';
  public userRole: string = '';
  public userId: number = 0;
  private service = inject(AuthService);

  constructor(public router: Router) {
    let user = localStorage.getItem('auth_user');
    if(user) {
      this.authUserExists = true;
      this.userName = JSON.parse(user)?.nombre;
      this.userRole = JSON.parse(user)?.role?.name;
      this.userId = JSON.parse(user)?.id;
    } 
  }

  ngOnInit() {}

  logout() {
    this.service.logout();
    this.router.navigateByUrl('/home');
    location.reload();
  }

  redirect(path: string) {
    window.location.assign(path);
  }
}