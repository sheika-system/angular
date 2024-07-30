export class MapComponent {
    map: google.maps.Map;
    marker: google.maps.Marker;
    infoDiv: HTMLElement;
  
    constructor(mapElementId: string, infoElementId: string) {
      const mapElement = document.getElementById(mapElementId) as HTMLElement;
      this.infoDiv = document.getElementById(infoElementId) as HTMLElement;
  
      this.map = new google.maps.Map(mapElement, {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
      });
  
      this.marker = new google.maps.Marker({
        position: { lat: -34.397, lng: 150.644 },
        map: this.map,
        title: "Hello World!",
      });
  
      this.addClickListener();
    }
  
    addClickListener(): void {
      this.map.addListener("click", (event: google.maps.MapMouseEvent) => {
        if (event.latLng) {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          this.infoDiv.innerHTML = `Latitude: ${lat}, Longitude: ${lng}`;
          this.marker.setPosition(event.latLng);
        }
      });
    }
  }
  