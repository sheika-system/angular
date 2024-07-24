import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GoogleMapsModule } from '@angular/google-maps';
import { MapComponent } from './components/map/map.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    GoogleMapsModule,
    MapComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'demo-angular-front';
}
