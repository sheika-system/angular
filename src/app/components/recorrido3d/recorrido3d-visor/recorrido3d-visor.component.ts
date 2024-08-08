import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, inject, Input, OnChanges, OnInit, SimpleChanges, untracked } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IImagen, IRecorrido3D, TourConfig } from '@app/interfaces';
import { ImagenService } from '@app/services/imagen.service';
import { Recorrido3dService } from '@app/services/recorrido3d.service';
declare const pannellum: any;
@Component({
  selector: 'app-recorrido3d-visor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recorrido3d-visor.component.html',
  styleUrl: './recorrido3d-visor.component.scss'
})
export class Recorrido3dVisorComponent implements OnInit, OnChanges {
  @Input() propiedadId: number | null = null;
  @Input() recorrido3d: IRecorrido3D | null = null;

  recorrido3dService = inject(Recorrido3dService)
  imagenService = inject(ImagenService)
  private imagenesLoaded = false;
  private imagenesRecorrido3d: IImagen[] = [];
  viewer: any;
  tourConfig: TourConfig | null = null;
  verDetalleRecorrido : boolean = true;

  // constructor() {
  //   if(this.propiedadId !== 0 && this.recorrido3d == null){
  //     effect(() => {
  //       const recorrido = this.recorrido3dService.recorrido3dRegistrado$();
  //       if (recorrido !== null && recorrido.recorrido3dId !== undefined) {
  //         this.recorrido3d = recorrido;
  //         console.log("this.recorrido3d", this.recorrido3d);
  //         if (!this.imagenesLoaded) {
  //           this.loadImagenesRecorrido3d(recorrido.recorrido3dId);
  //           this.imagenesLoaded = true;
  //         }
  //       } else if (recorrido !== null) {
  //         console.error('RecorridoId no está definido');
  //       }
  //     });
  //     effect(() => {
  //       const imagenes = this.imagenService.imagenesRecorrido3d$();
  //       this.imagenesRecorrido3d = imagenes
  //       console.log('Imágenes cargadas:', this.imagenesRecorrido3d);
  //       this.initPanellum();
  //     });
  //   }else{
  //     effect(() => {
  //       const imagenes = this.imagenService.imagenesRecorrido3d$();
  //       this.imagenesRecorrido3d = imagenes
  //       console.log('Imágenes cargadas:', this.imagenesRecorrido3d);
  //       this.initPanellum();
  //     });
  //   }
  // }

  constructor() {
    effect(() => {
      // Este efecto maneja la carga de imágenes, ya sea que vengan del servicio o del input
      const imagenes = this.imagenService.imagenesRecorrido3d$();
      if (imagenes.length > 0) {
        this.imagenesRecorrido3d = imagenes;
        console.log('Imágenes cargadas:', this.imagenesRecorrido3d);
        this.initPanellum();
      }
    });

    effect(() => {
      console.log("VISOR recorrido3d", this.recorrido3d);
      // Este efecto maneja el caso cuando se proporciona solo propiedadId
      if (this.propiedadId !== null && !this.recorrido3d) {
        const recorrido = this.recorrido3dService.recorrido3dRegistrado$();
        if (recorrido !== null && recorrido.recorrido3dId !== undefined) {
          this.recorrido3d = recorrido;
          console.log("Recorrido3D cargado desde el servicio:", this.recorrido3d);
          this.loadImagenesRecorrido3d(recorrido.recorrido3dId);
        }
      }
    });
  }
  

  // ngOnInit() {
  //   console.log('Cargando Pannellum');
  //   if (typeof pannellum?.viewer === 'function') {
  //     console.log('Pannellum cargado correctamente');
  //     this.loadRecorrido3d();
  //   } else {
  //     console.error('Pannellum no está cargado correctamente');
  //   }
  // }

  ngOnInit() {
    this.loadRecorrido3d();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['propiedadId'] || changes['recorrido3d']) {
      this.loadRecorrido3d();
    }
  }

  // loadRecorrido3d() {
  //   if(this.propiedadId !== 0 && this.recorrido3d !== null){
  //     console.log("entrando");
  //     console.log("enbtradndo", this.recorrido3d);
  //     const loadedId = untracked(() => this.recorrido3dService.loadedId$());
  //     if (loadedId !== this.propiedadId) {
  //       this.recorrido3dService.getByIdSignal(this.propiedadId);
  //     }
  //   }
  // }
  
  loadRecorrido3d() {
    if (this.recorrido3d && this.recorrido3d.recorrido3dId !== undefined) {
      // Caso: Se recibió un recorrido3d directamente (desde el form)
      console.log("Usando recorrido3D recibido directamente del form");
      this.loadImagenesRecorrido3d(this.recorrido3d.recorrido3dId);
    } else if (this.propiedadId !== null) {
      // Caso: Solo se recibió propiedadId (usado en otra parte del proyecto)
      console.log("Cargando recorrido3D para propiedadId:", this.propiedadId);
      this.recorrido3dService.getByIdSignal(this.propiedadId);
    }
  }

  // loadImagenesRecorrido3d(recorrido3dId: number) {
  //   if (this.recorrido3d && this.recorrido3d.archivoRecorrido) {
  //     this.tourConfig = JSON.parse(this.recorrido3d.archivoRecorrido) as TourConfig;
  //     this.imagenService.getImagenesRecorrido3dById(recorrido3dId);
  //   }
  // }

  loadImagenesRecorrido3d(recorrido3dId: number) {
    if (this.recorrido3d && this.recorrido3d.archivoRecorrido) {
      this.tourConfig = JSON.parse(this.recorrido3d.archivoRecorrido) as TourConfig;
      this.imagenService.getImagenesRecorrido3dById(recorrido3dId);
    }
  }

  private handleNewRecorrido3d(recorrido: IRecorrido3D) {
    console.log("Nuevo recorrido3d recibido:", recorrido);
    this.imagenesLoaded = false;
    if (recorrido.recorrido3dId) {
      this.loadImagenesRecorrido3d(recorrido.recorrido3dId);
    }
  }

  initPanellum(): void {
    // if (this.recorrido3d && this.recorrido3d.archivoRecorrido) {
      if (this.recorrido3d && this.recorrido3d.archivoRecorrido && this.imagenesRecorrido3d.length > 0) {
      try {
        this.tourConfig = JSON.parse(this.recorrido3d.archivoRecorrido) as TourConfig;
        console.log('Tour config:', this.tourConfig);
  
        interface PannellumScene {
          title: string;
          panorama: string;
          hotSpots: any[];
        }
  
        interface PannellumConfig {
          default: {
            firstScene: string;
            hfov?: number;
            minHfov?: number;
            maxHfov?: number;
            autoLoad?: boolean;
            autoRotate?: number;
          };
          scenes: {
            [key: string]: PannellumScene;
          };
        }
  
        const pannellumConfig: PannellumConfig = {
          default: {
            firstScene: this.tourConfig.firstScene,
            hfov: 100, // Campo de visión horizontal
            maxHfov: 120, // Máximo campo de visión horizontal
            minHfov: 50, // Mínimo campo de visión horizontal
            autoLoad: true, // Cargar la imagen automáticamente
          },
          scenes: {}
        };
  
        Object.entries(this.tourConfig.scenes).forEach(([sceneId, scene]) => {
          const imagen = this.imagenesRecorrido3d.find(img => img.imagenId === scene.imageId);
          if (imagen) {
            // Asegurarse de que el base64 tenga el prefijo correcto
            const base64Prefix = 'data:image/jpeg;base64,';
            const panoramaData = imagen.imagen?.startsWith(base64Prefix) 
              ? imagen.imagen 
              : base64Prefix + imagen.imagen;
  
            pannellumConfig.scenes[sceneId] = {
              title: scene.title,
              panorama: panoramaData,
              hotSpots: []
            };
          }
        });
  
        this.viewer = pannellum.viewer('panorama', pannellumConfig);
      } catch (error) {
        console.error('Error al inicializar Pannellum:', error);
        this.tourConfig = null;
      }
    }
  }

  changeScene(sceneId: string): void {
    if (this.viewer && typeof sceneId === 'string') {
      this.viewer.loadScene(sceneId);
    }
  }

}
