import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, effect, EventEmitter, Inject, inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
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
export class Recorrido3dVisorComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() recorrido3d: IRecorrido3D | null = null;
  @Output() panoramaCargado: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() recorrido3dEliminado: EventEmitter<void> = new EventEmitter<void>();

  recorrido3dService = inject(Recorrido3dService)
  imagenService = inject(ImagenService);
  private imagenesRecorrido3d: IImagen[] = [];
  viewer: any;
  tourConfig: TourConfig | null = null;
  verDetalleRecorrido: boolean = true;
  panoramaReady = false;
  recorridoExiste = false;

  constructor() {
    effect(() => {
      const imagenes = this.imagenService.imagenesRecorrido3d$();
      if (imagenes.length > 0) {
        this.imagenesRecorrido3d = imagenes;
        // console.log('Imágenes cargadas:', this.imagenesRecorrido3d);
        this.initPanellum();
      }
    });
  }

  ngOnInit() {
    this.loadRecorrido3d();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['recorrido3d']) {
      this.loadRecorrido3d();
    }
  }

  loadRecorrido3d() {
    // console.log('Cargando recorrido3D:', this.recorrido3d);
    if (this.recorrido3d && this.recorrido3d.recorrido3dId !== undefined && this.recorrido3d.archivoRecorrido) {
      // console.log("Recorrido3D válido encontrado:", this.recorrido3d);
      this.recorridoExiste = true;
      this.loadImagenesRecorrido3d(this.recorrido3d.recorrido3dId);
    } else {
      console.log("No existe Recorrido 3D registrado previamente.");
      this.recorridoExiste = false;
      this.panoramaReady = false;
      this.panoramaCargado.emit(this.panoramaReady);
      this.resetViewer();
    }
  }

  loadImagenesRecorrido3d(recorrido3dId: number) {
    if (this.recorrido3d && this.recorrido3d.archivoRecorrido) {
      this.tourConfig = JSON.parse(this.recorrido3d.archivoRecorrido) as TourConfig;
      this.imagenService.getImagenesRecorrido3dById(recorrido3dId);
    }
  }

  resetViewer() {
    if (this.viewer) {
      this.viewer.destroy();
      this.viewer = null;
    }
    this.tourConfig = null;
    this.imagenesRecorrido3d = [];
  }

  initPanellum(): void {
    if (this.recorrido3d && this.recorrido3d.archivoRecorrido && this.imagenesRecorrido3d.length > 0) {
      try {
        this.tourConfig = JSON.parse(this.recorrido3d.archivoRecorrido) as TourConfig;
        // console.log('Tour config:', this.tourConfig);

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
            hfov: 100,
            maxHfov: 120,
            minHfov: 50,
            autoLoad: true,
          },
          scenes: {}
        };

        Object.entries(this.tourConfig.scenes).forEach(([sceneId, scene]) => {
          const imagen = this.imagenesRecorrido3d.find(img => img.imagenId === scene.imageId);
          if (imagen) {
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

        if (this.viewer) {
          this.viewer.destroy();
        }
        this.viewer = pannellum.viewer('panorama', pannellumConfig);
      } catch (error) {
        console.error('Error al inicializar Pannellum:', error);
        this.tourConfig = null;
      }
    }
    this.panoramaReady = true;
    this.panoramaCargado.emit(this.panoramaReady);
  }

  changeScene(sceneId: string): void {
    if (this.viewer && typeof sceneId === 'string') {
      this.viewer.loadScene(sceneId);
    }
  }

  ngAfterViewInit() {
    this.loadPanorama();
  }

  loadPanorama() {
    setTimeout(() => {
      this.panoramaReady = this.recorridoExiste;
      this.panoramaCargado.emit(this.panoramaReady);
    }, 1000);
  }

  eliminarRecorrido3D() {
    if (this.recorrido3d && this.recorrido3d.recorrido3dId) {
      this.recorrido3dService.deleteRecorrido3dSignal(this.recorrido3d).subscribe({
        next: () => {
          this.recorrido3dEliminado.emit();
          this.resetViewer();
          this.recorrido3d = null;
          this.recorridoExiste = false;
          this.panoramaReady = false;
          this.panoramaCargado.emit(false);
        },
        error: (error: any) => {
          console.error('Error al eliminar el recorrido 3D:', error);
        }
      });
    } else {
      console.error('No hay un recorrido 3D válido para eliminar');
      this.recorrido3dEliminado.emit();
    }
  }
}