import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { GoogleMapsModule } from '@angular/google-maps';

@NgModule({
  declarations: [
  
  ],
  imports: [
    BrowserModule,
    GoogleMapsModule,
    AppComponent
  ],
  providers: [],
  bootstrap: []
})
export class AppModule { }