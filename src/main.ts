import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { MapComponent } from './app/components/map/MapComponent';


bootstrapApplication(AppComponent)
  .catch(err => console.error(err));

