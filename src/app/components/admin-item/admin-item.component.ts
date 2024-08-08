import { Component, Input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-item.component.html',
  styleUrl: './admin-item.component.scss'
})
export class AdminItemComponent {
  @Input() name!: string;
  @Input() icon!: string;
  @Input() path!: string;

  constructor(public router: Router) {}

  protected redirect() {
    this.router.navigateByUrl('/' + this.path);
  }
}
