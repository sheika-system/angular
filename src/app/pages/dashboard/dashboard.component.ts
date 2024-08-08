import { Component } from '@angular/core';
import { AdminItemComponent } from "../../components/admin-item/admin-item.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [AdminItemComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {

}
