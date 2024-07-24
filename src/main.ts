import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { MapComponent } from './app/components/map/MapComponent';

<<<<<<< Updated upstream
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  function initMap(): void {
    new MapComponent('map', 'info');
  }
  
  declare global {
    interface Window { initMap: () => void; }
  }
  window.initMap = initMap;
=======
bootstrapApplication(AppComponent)
  .catch(err => console.error(err));
>>>>>>> Stashed changes
