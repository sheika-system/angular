import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  standalone: true,
  imports: [GoogleMapsModule]
})
export class MapComponent implements OnInit {
  center: google.maps.LatLngLiteral = { lat: 51.678418, lng: 7.809007 };
  zoom = 8;
  markerPosition: google.maps.LatLngLiteral | null = null;

  constructor() {}

  ngOnInit(): void {}

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      this.markerPosition = { lat: event.latLng.lat(), lng: event.latLng.lng() };
    }
  }
}
