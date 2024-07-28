import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { GoogleMap, GoogleMapsModule } from '@angular/google-maps';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  standalone: true,
  imports: [GoogleMapsModule, CommonModule  ]
})
export class MapComponent implements OnInit {
  @ViewChild(GoogleMap) map!: GoogleMap;

  center: google.maps.LatLngLiteral = {lat: 9.748917, lng: -83.753428}; // Centro de Costa Rica
  initialZoom = 8;
  zoom = this.initialZoom;
  markerPosition: google.maps.LatLngLiteral | null = null;
  markerOptions: google.maps.MarkerOptions = {draggable: false};

  selectedLocation: any = null;

  @Output() onUbicacionChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() onResetMap: EventEmitter<boolean> = new EventEmitter<boolean>();

  mapSelectionInfo = {
    markerPosition: this.markerPosition,
    selectedLocation: this.selectedLocation
  }

  mapOptions: google.maps.MapOptions = {
    center: this.center,
    zoom: this.initialZoom
  };

  ngOnInit() {
    // Initialization logic if needed
  }

  onMapClick(event: google.maps.MapMouseEvent): void {
    if (event.latLng) {
      const clickedPosition = { lat: event.latLng.lat(), lng: event.latLng.lng() };
      
      if (!this.markerPosition || 
          this.markerPosition.lat !== clickedPosition.lat || 
          this.markerPosition.lng !== clickedPosition.lng) {
        this.markerPosition = clickedPosition;
        
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: event.latLng }, (results, status) => {
          if (status === 'OK' && results && results.length > 0) {
            const result = results[0];
            if (result.address_components) {
              this.selectedLocation = this.parseAddressComponents(result.address_components);
              this.mapSelectionInfo.markerPosition = this.markerPosition;
              this.mapSelectionInfo.selectedLocation = this.selectedLocation;
              this.shareLocation()
            } else {
              this.handleGeocodeError('No se encontraron componentes de dirección');
            }
          } else {
            this.handleGeocodeError(`Geocodificación fallida debido a: ${status}`);
          }
        });
      }
    }
  }
  
  private handleGeocodeError(message: string): void {
    console.error(message);
    this.selectedLocation = null;
    // Aquí puedes añadir lógica adicional para manejar el error, como mostrar un mensaje al usuario
  }

  onMarkerClick(): void {
    this.markerPosition = null;
  }

  parseAddressComponents(components: google.maps.GeocoderAddressComponent[]): any {
    let provincia = '', canton = '', distrito = '';
    
    for (let component of components) {
      if (component.types.includes('administrative_area_level_1')) {
        provincia = component.long_name.replace("Provincia de ", "");
      } else if (component.types.includes('administrative_area_level_2')) {
        canton = component.long_name;
      } else if (component.types.includes('locality') || component.types.includes('sublocality')) {
        distrito = component.long_name;
      }
    }
  
    // Si no se encontró el cantón, busca 'administrative_area_level_3'
    if (!canton) {
      const level3 = components.find(c => c.types.includes('administrative_area_level_3'));
      if (level3) canton = level3.long_name;
    }
  
    // Si no se encontró el distrito, busca 'neighborhood'
    if (!distrito) {
      const neighborhood = components.find(c => c.types.includes('neighborhood'));
      if (neighborhood) distrito = neighborhood.long_name;
    }

    return { provincia, canton, distrito };
  }

  resetMap() {
    this.mapOptions = {
      center: this.center,
      zoom: this.initialZoom
    };
    this.markerPosition = null;
    this.selectedLocation = null;
    this.onResetMap.emit(true);
  }

  shareLocation(){
    this.onUbicacionChange.emit(this.mapSelectionInfo);
  }

}