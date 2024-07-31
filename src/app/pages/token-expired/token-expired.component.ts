import { Component } from '@angular/core';

@Component({
  selector: 'app-token-expired',
  standalone: true,
  imports: [],
  templateUrl: './token-expired.component.html',
  styleUrl: './token-expired.component.scss'
})
export class TokenExpiredComponent {
  volverLogin() {
    window.location.assign('/login');
  }
}
