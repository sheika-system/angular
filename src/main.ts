import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { MapComponent } from './app/components/map/MapComponent';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  function initMap(): void {
    new MapComponent('map', 'info');
  }
  
  declare global {
    interface Window { initMap: () => void; }
  }
  window.initMap = initMap;