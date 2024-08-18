import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, OnChanges, OnInit, Output, ViewChild, NgZone, ChangeDetectorRef, SimpleChanges, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BehaviorSubject, combineLatest, debounceTime, Observable, Subject } from 'rxjs';
import { IImagen, IPuntoInteres, IRecorrido3D, TourConfig } from '@app/interfaces';
import { ImagenService } from '@app/services/imagen.service';
import { PuntoInteresService } from '@app/services/punto-interes.service';
import { Recorrido3dService } from '@app/services/recorrido3d.service';
import { PuntointeresFormComponent } from "../../punto-interes/puntointeres-form/puntointeres-form.component";

declare const pannellum: any;

@Component({
  selector: 'app-recorrido3d-visor',
  standalone: true,
  imports: [CommonModule, FormsModule, PuntointeresFormComponent],
  templateUrl: './recorrido3d-visor.component.html',
  styleUrl: './recorrido3d-visor.component.scss'
})
export class Recorrido3dVisorComponent implements OnInit, OnChanges {
  @ViewChild('panorama', { static: false }) panoramaElement!: ElementRef;
  @Input() recorrido3d: IRecorrido3D | null = null;
  @Input() esPropietario: boolean = false;
  @Output() panoramaCargado: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() recorrido3dEliminado: EventEmitter<void> = new EventEmitter<void>();

  private panoramaReadySubject = new BehaviorSubject<boolean>(false);
  panoramaReady$: Observable<boolean> = this.panoramaReadySubject.asObservable();

  private imagenesRecorrido3d: IImagen[] = [];
  viewer: any;
  tourConfig: TourConfig | null = null;
  verDetalleRecorrido = true;
  recorridoExiste = false;
  currentSceneId: string = '';

  showPuntoInteresForm = false;
  showConfirmDialog = false;
  currentPuntoInteres: IPuntoInteres | null = null;
  puntosInteresList: IPuntoInteres [] = [];
  clickPosition: { pitch: number, yaw: number } | null = null;
  formPosition = { x: 0, y: 0 };
  private isMouseDown = false;
  private hasMoved = false;
  private mouseDownTime: number = 0;
  isFullscreen = false;
  isAddingHotspot: boolean = false;
  private currentHotspotIds: string[] = [];

  private imagenesReadySubject = new BehaviorSubject<boolean>(false);
  private puntosInteresReadySubject = new BehaviorSubject<boolean>(false);
  private sceneChangeSubject = new Subject<string>();
  private isChangingScene = false;
  
  formData: {
    posicionX: number;
    posicionY: number;
    escenaId: string;
  } | null = null;


  constructor(
    private recorrido3dService: Recorrido3dService,
    private imagenService: ImagenService,
    private puntoInteresService: PuntoInteresService,
    private ngZone: NgZone,
    private cdr: ChangeDetectorRef
  ) {

    effect(() => {
      const imagenes = this.imagenService.imagenesRecorrido3d$();
      if (imagenes.length > 0) {
        this.imagenesRecorrido3d = imagenes;
        this.imagenesReadySubject.next(true);
      } else {
        this.imagenesReadySubject.next(false);
      }
    });

    effect(() => {
      const puntosInteres = puntoInteresService.puntoInteresList$();
      this.puntosInteresList = puntosInteres;
      this.puntosInteresReadySubject.next(true);
    });

    combineLatest([
      this.imagenesReadySubject,
      this.puntosInteresReadySubject
    ]).subscribe(([imagenesReady, puntosInteresReady]) => {
      if (imagenesReady && puntosInteresReady) {
        this.initPanellum();
      }
    });

    this.sceneChangeSubject.pipe(
      debounceTime(300) // Adjust this value as needed
    ).subscribe(sceneId => {
      this.handleSceneChange(sceneId);
    });
  }

  ngOnInit() {
    this.loadRecorrido3d();
    this.initializePannellumEvents();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['recorrido3d']) {
      this.loadRecorrido3d();
    }

    if (changes['esPropietario']) {
    }
  }

  private initializePannellumEvents() {
    if (this.viewer) {
      this.viewer.on('mousedown', this.handleMouseDown.bind(this));
      this.viewer.on('mousemove', this.handleMouseMove.bind(this));
      this.viewer.on('mouseup', this.handleMouseUp.bind(this));
      this.viewer.on('fullscreenchange', this.handleFullscreenChange.bind(this));
      this.viewer.on('scenechange', this.handleSceneChange.bind(this));
    }
  }

  private handleFullscreenChange(): void {
    this.ngZone.run(() => {
      this.isFullscreen = !this.isFullscreen;
      if (this.isFullscreen) {
        this.closeAllDialogs();
      }
      this.cdr.detectChanges();
    });
  }

  private closeAllDialogs(): void {
    this.showConfirmDialog = false;
    this.showPuntoInteresForm = false;
    this.clickPosition = null;
  }
  

  loadRecorrido3d() {
    if (this.recorrido3d && this.recorrido3d.recorrido3dId !== undefined && this.recorrido3d.archivoRecorrido) {
      this.recorridoExiste = true;
      this.loadImagenesRecorrido3d(this.recorrido3d.recorrido3dId);
      this.loadPuntosInteresRecorrido(this.recorrido3d.recorrido3dId);
    } else {
      this.recorridoExiste = false;
      this.setPanoramaReady(false);
      this.resetViewer();
    }
  }

  loadImagenesRecorrido3d(recorrido3dId: number) {
    if (this.recorrido3d && this.recorrido3d.archivoRecorrido) {
      this.tourConfig = JSON.parse(this.recorrido3d.archivoRecorrido) as TourConfig;
      this.imagenService.getImagenesRecorrido3dById(recorrido3dId);
    }
  }

  loadPuntosInteresRecorrido(recorrido3dId: number){
    if (this.recorrido3d && this.recorrido3d.archivoRecorrido) {
      this.puntoInteresService.getPuntoInteresByRecorrido3d(recorrido3dId);
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
    this.ngZone.runOutsideAngular(() => {
      if (this.recorrido3d && this.recorrido3d.archivoRecorrido && this.imagenesRecorrido3d.length > 0) {
        try {
          this.tourConfig = JSON.parse(this.recorrido3d.archivoRecorrido) as TourConfig;
          const pannellumConfig = this.createPannellumConfig();
          
          if (this.viewer) {
            this.viewer.destroy();
          }
          
          this.viewer = pannellum.viewer('panorama', pannellumConfig);
          this.initializePannellumEvents();
          
          this.viewer.on('load', () => {
            this.ngZone.run(() => {
              this.currentSceneId = this.viewer.getScene();
              this.setPanoramaReady(true);
              this.loadExistingPuntosInteres();
              this.cdr.detectChanges();
            });
          });

          this.viewer.on('scenechange', (sceneId: string) => {
            this.sceneChangeSubject.next(sceneId);
          });

        } catch (error) {
          console.error('Error al inicializar Pannellum:', error);
          this.setPanoramaReady(false);
        }
      }
    });
  }

  createPannellumConfig() {
    const pannellumConfig: any = {
      default: {
        firstScene: this.tourConfig!.firstScene,
        hfov: 100,
        maxHfov: 120,
        minHfov: 50,
        autoLoad: true,
      },
      scenes: {}
    };

    Object.entries(this.tourConfig!.scenes).forEach(([sceneId, scene]) => {
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

    return pannellumConfig;
  }

  private handleMouseDown(event: MouseEvent): void {
    if (event.button !== 0) return; // Solo procesar clic izquierdo
    this.isMouseDown = true;
    this.hasMoved = false;
    this.mouseDownTime = new Date().getTime();
  }

  private handleMouseMove(): void {
    if (this.isMouseDown) {
      this.hasMoved = true;
    }
  }

  private handleMouseUp(event: MouseEvent): void {
    if (event.button !== 0) return; // Solo procesar clic izquierdo
    const mouseUpTime = new Date().getTime();
    const timeDiff = mouseUpTime - this.mouseDownTime;

    if (!this.hasMoved && timeDiff < 200 && !this.isFullscreen && this.esPropietario) {
      this.handleClick(event);
    }

    this.isMouseDown = false;
    this.hasMoved = false;
  }

  private handleClick(event: MouseEvent): void {
    if (this.isFullscreen) {
      return; // No hacer nada si está en pantalla completa
    }

    this.ngZone.run(() => {
      const coords = this.viewer.mouseEventToCoords(event);
      
      if (this.panoramaElement && this.panoramaElement.nativeElement) {
        this.formData = {
          posicionX: coords[0],
          posicionY: coords[1],
          escenaId: this.currentSceneId
        };

        const rect = this.panoramaElement.nativeElement.getBoundingClientRect();
        this.clickPosition = {
          pitch: coords[0],
          yaw: coords[1]
        };
        
        this.formPosition = {
          x: this.clickPosition?.pitch,
          y: this.clickPosition?.yaw,
        };

        this.showConfirmDialog = true;
        this.cdr.detectChanges();
      } else {
        console.error('Elemento del panorama no disponible');
      }
    });
  }

  private handleSceneChange(sceneId: string): void {
    if (this.isChangingScene) {
      return;
    }

    this.isChangingScene = true;

    this.ngZone.run(() => {
      this.currentSceneId = sceneId;
      
      // Wrap in a setTimeout to ensure it runs after current change detection cycle
      setTimeout(() => {
        this.loadExistingPuntosInteres();
        this.cdr.detectChanges();
        this.isChangingScene = false;
      }, 0);
    });
  }

  changeScene(sceneId: string): void {
    if (this.viewer && typeof sceneId === 'string' && !this.isChangingScene) {
      this.viewer.loadScene(sceneId);
    }
  }

  eliminarRecorrido3D() {
    if (this.recorrido3d && this.recorrido3d.recorrido3dId) {
      this.recorrido3dService.deleteRecorrido3dSignal(this.recorrido3d).subscribe({
        next: () => {
          this.recorrido3dEliminado.emit();
          this.resetViewer();
          this.recorrido3d = null;
          this.recorridoExiste = false;
          this.setPanoramaReady(false);
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

  loadExistingPuntosInteres() {
    this.removeAllHotspots();

    if (this.puntosInteresList.length > 0) {
      this.puntosInteresList.forEach(punto => {
        if (punto.escenaId === this.currentSceneId) {
          this.addHotspotToViewer(punto);
        }
      });
    }
  }

  removeAllHotspots() {
    if (this.viewer) {
      this.currentHotspotIds.forEach(id => {
        this.viewer.removeHotSpot(id);
      });
      this.currentHotspotIds = [];
    }
  }

  addHotspotToViewer(punto: IPuntoInteres) {
    if (punto.posicionX !== undefined && punto.posicionY !== undefined && punto.puntoInteresId !== undefined) {
      const hotspotId = `puntoInteres_${punto.puntoInteresId}`;
      const hotspotConfig: any = {
        pitch: punto.posicionX,
        yaw: punto.posicionY,
        cssClass: "custom-hotspot",
        createTooltipFunc: this.createTooltip,
        createTooltipArgs: punto.nombre || "Sin nombre",
        id: hotspotId,
      };
  
      // Solo añadir el clickHandlerFunc si esPropietario es true
      if (this.esPropietario) {
        hotspotConfig.clickHandlerFunc = (event: any) => this.onHotspotClick(event, punto);
      }
  
      this.viewer.addHotSpot(hotspotConfig);
      this.currentHotspotIds.push(hotspotId);
    }
  }
  private createTooltip(hotSpotDiv: HTMLElement, tooltipArg: string) {
    hotSpotDiv.classList.add('custom-hotspot');
    const tooltipSpan = document.createElement('span');
    tooltipSpan.classList.add('hotspot-tooltip');
    tooltipSpan.textContent = tooltipArg;
    hotSpotDiv.appendChild(tooltipSpan);
  }

  onHotspotClick(event: any, punto: IPuntoInteres) {
    event.stopPropagation();
    this.ngZone.run(() => {
      this.currentPuntoInteres = punto;
      this.showDeleteConfirmDialog();
    });
  }

  showDeleteConfirmDialog() {
    if (confirm('¿Estás seguro de que quieres eliminar este punto de interés?')) {
      this.deletePuntoInteres();
    }
  }

  deletePuntoInteres() {
    if (this.currentPuntoInteres && this.currentPuntoInteres.puntoInteresId) {
      this.puntoInteresService.deletePuntoInteres(this.currentPuntoInteres).subscribe({
        next: () => {
          this.removeHotspotFromViewer(this.currentPuntoInteres!.puntoInteresId!);
          this.puntosInteresList = this.puntosInteresList.filter(p => p.puntoInteresId !== this.currentPuntoInteres!.puntoInteresId);
          this.currentPuntoInteres = null;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error al eliminar el punto de interés:', error);
          // Implementa manejo de errores aquí (ej. mostrar un mensaje al usuario)
        }
      });
    }
  }

  removeHotspotFromViewer(puntoInteresId: number) {
    const hotspotId = `puntoInteres_${puntoInteresId}`;
    if (this.viewer) {
      this.viewer.removeHotSpot(hotspotId);
    }
    this.currentHotspotIds = this.currentHotspotIds.filter(id => id !== hotspotId);
  }

  toggleAddHotspotMode() {
    this.isAddingHotspot = !this.isAddingHotspot;
    if (this.isAddingHotspot) {
      this.panoramaElement.nativeElement.style.cursor = 'crosshair';
    } else {
      this.panoramaElement.nativeElement.style.cursor = 'default';
    }
  }
  
  showAddHotspotForm() {
    this.showPuntoInteresForm = true;
    this.showConfirmDialog = false;
  }

  onPuntoInteresAdded(puntoInteres: IPuntoInteres) {
    this.addHotspotToViewer(puntoInteres);
    this.puntosInteresList.push(puntoInteres);
    this.showPuntoInteresForm = false;
    this.isAddingHotspot = false;
    this.panoramaElement.nativeElement.style.cursor = 'default';
  }
  
  onConfirmAddPuntoInteres() {
    this.showConfirmDialog = false;
    if (this.formData && this.recorrido3d) {
      // Asegurarse de que el escenaId esté actualizado justo antes de mostrar el formulario
      this.formData.escenaId = this.currentSceneId;
      this.showPuntoInteresForm = true;
      this.cdr.detectChanges();
    } else {
      console.error('No se puede mostrar el formulario: falta información necesaria');
    }
  }

  onCancelAddPuntoInteres() {
    this.showConfirmDialog = false;
    this.clickPosition = null;
    this.showPuntoInteresForm = false;
  }

  private setPanoramaReady(isReady: boolean) {
    this.panoramaReadySubject.next(isReady);
    this.panoramaCargado.emit(isReady);
  }
}