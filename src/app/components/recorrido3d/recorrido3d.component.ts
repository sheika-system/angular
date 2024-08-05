import { AfterViewInit, Component, effect, inject, Input, OnInit, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Recorrido3dService } from '../../services/recorrido3d.service';
import { IImagen, IRecorrido3D, TourConfig } from '../../interfaces';
import { ImagenService } from '@app/services/imagen.service';
import { Recorrido3dFormComponent } from "./recorrido3d-form/recorrido3d-form.component";
import { Recorrido3dVisorComponent } from './recorrido3d-visor/recorrido3d-visor.component';


// declare const pannellum: any;
@Component({
  selector: 'app-recorrido3d',
  standalone: true,
  imports: [CommonModule, FormsModule, Recorrido3dFormComponent, Recorrido3dVisorComponent],
  templateUrl: './recorrido3d.component.html',
  styleUrl: './recorrido3d.component.scss'
})
export class Recorrido3dComponent implements OnInit{
  recorrido3d: IRecorrido3D | null = null;
  // recorrido3dService = inject(Recorrido3dService)
  // imagenService = inject(ImagenService)

  // private imagenesLoaded = false;
  // private imagenesRecorrido3d: IImagen[] = [];
  propiedadId : number = 0;
  // images: {file: File, url: string}[] = [];
  // draggedIndex: number | null = null;
  // dragOverIndex: number | null = null;
  // nombre: string = '';
  // descripcion: string = '';
  
  // viewer: any;
  // tourConfig: TourConfig | null = null;

  mostrarPanorama(recorrido3d: IRecorrido3D){
    this.recorrido3d = recorrido3d
    console.log("this.recorrido3d output", this.recorrido3d);
  }
  constructor(){
    this.propiedadId = 3;
  }
  ngOnInit(): void {
    this.propiedadId = 3;
  }

  // constructor() {
  //   effect(() => {
  //     const recorrido = this.recorrido3dService.recorrido3dRegistrado$();
  //     if (recorrido !== null && recorrido.recorrido3dId !== undefined) {
  //       this.recorrido3d = recorrido;
  //       console.log("this.recorrido3d", this.recorrido3d);
  //       if (!this.imagenesLoaded) {
  //         this.loadImagenesRecorrido3d(recorrido.recorrido3dId);
  //         this.imagenesLoaded = true;
  //       }
  //     } else if (recorrido !== null) {
  //       console.error('RecorridoId no está definido');
  //     }
  //   });
  //   effect(() => {
  //     const imagenes = this.imagenService.imagenesRecorrido3d$();
  //     this.imagenesRecorrido3d = imagenes
  //     console.log('Imágenes cargadas:', this.imagenesRecorrido3d);
  //     this.initPanellum();
  //   });
  // }

  // ngOnInit() {
  //   console.log('Cargando Pannellum');
  //   if (typeof pannellum?.viewer === 'function') {
  //     console.log('Pannellum cargado correctamente');
  //     this.loadRecorrido3d(5);
  //   } else {
  //     console.error('Pannellum no está cargado correctamente');
  //   }
  // }

  // loadRecorrido3d(propiedadId: number) {
  //   const loadedId = untracked(() => this.recorrido3dService.loadedId$());
  //   if (loadedId !== propiedadId) {
  //     this.recorrido3dService.getByIdSignal(propiedadId);
  //   }
  // }

  // loadImagenesRecorrido3d(recorrido3dId: number) {
  //   if (this.recorrido3d && this.recorrido3d.archivoRecorrido) {
  //     this.tourConfig = JSON.parse(this.recorrido3d.archivoRecorrido) as TourConfig;
  //     this.imagenService.getImagenesRecorrido3dById(recorrido3dId);
  //   }
  // }

  // ngAfterViewInit() {
  //   // if (this.recorrido3d && this.recorrido3d.archivoRecorrido) {
  //   //   this.initPanellum();
  //   // }
  // }
  
  // // ============================================
  // // Metodos para el visor Panellum
  // // ============================================

  // initPanellum(): void {
  //   if (this.recorrido3d && this.recorrido3d.archivoRecorrido) {
  //     try {
  //       this.tourConfig = JSON.parse(this.recorrido3d.archivoRecorrido) as TourConfig;
  //       console.log('Tour config:', this.tourConfig);
  
  //       interface PannellumScene {
  //         title: string;
  //         panorama: string;
  //         hotSpots: any[];
  //       }
  
  //       interface PannellumConfig {
  //         default: {
  //           firstScene: string;
  //           hfov?: number;
  //           minHfov?: number;
  //           maxHfov?: number;
  //           autoLoad?: boolean;
  //           autoRotate?: number;
  //         };
  //         scenes: {
  //           [key: string]: PannellumScene;
  //         };
  //       }
  
  //       const pannellumConfig: PannellumConfig = {
  //         default: {
  //           firstScene: this.tourConfig.firstScene,
  //           hfov: 100, // Campo de visión horizontal
  //           maxHfov: 120, // Máximo campo de visión horizontal
  //           minHfov: 50, // Mínimo campo de visión horizontal
  //           autoLoad: true, // Cargar la imagen automáticamente
  //         },
  //         scenes: {}
  //       };
  
  //       Object.entries(this.tourConfig.scenes).forEach(([sceneId, scene]) => {
  //         const imagen = this.imagenesRecorrido3d.find(img => img.imagenId === scene.imageId);
  //         if (imagen) {
  //           // Asegurarse de que el base64 tenga el prefijo correcto
  //           const base64Prefix = 'data:image/jpeg;base64,';
  //           const panoramaData = imagen.imagen?.startsWith(base64Prefix) 
  //             ? imagen.imagen 
  //             : base64Prefix + imagen.imagen;
  
  //           pannellumConfig.scenes[sceneId] = {
  //             title: scene.title,
  //             panorama: panoramaData,
  //             hotSpots: []
  //           };
  //         }
  //       });
  
  //       this.viewer = pannellum.viewer('panorama', pannellumConfig);
  //     } catch (error) {
  //       console.error('Error al inicializar Pannellum:', error);
  //       this.tourConfig = null;
  //     }
  //   }
  // }

  // // isFormValid(): boolean {
  // //   return this.nombre.trim().length > 0 && this.images.length > 0;
  // // }

  // changeScene(sceneId: string): void {
  //   if (this.viewer && typeof sceneId === 'string') {
  //     this.viewer.loadScene(sceneId);
  //   }
  // }
  // ============================================
  // Metodos para el visor Panellum
  // ============================================

  // onFileSelected(event: any) {
  //   const files = event.target.files;
  //   for (let file of files) {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.images.push({ file: file, url: e.target.result });
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // }

  // removeImage(index: number) {
  //   this.images.splice(index, 1);
  // }

  // createTour() {
  //   if (!this.isFormValid()) {
  //     alert('Por favor, complete todos los campos requeridos.');
  //     return;
  //   }

  //   const files = this.images.map(img => img.file);

  //   this.propiedadId = "5";
    
  //   this.recorrido3dService.saveRecorrido3D(files, this.nombre, this.descripcion, this.propiedadId)
  //     .subscribe({
  //       next: (response) => {
  //         this.recorrido3d = response;
  //         console.log('Recorrido 3D creado:', this.recorrido3d);
  //         setTimeout(() => {
  //           console.log('Llamando a initPanellum');
  //           this.initPanellum();
  //         }, 0);
  //       },
  //       error: (error) => {
  //         console.error('Error al crear el recorrido 3D:', error);
  //       }
  //     });
  // }

  // onDragStart(event: DragEvent, index: number) {
  //   this.draggedIndex = index;
  //   if (event.dataTransfer) {
  //     event.dataTransfer.effectAllowed = 'move';
  //     event.dataTransfer.setData('text/plain', index.toString());
  //   }
  // }

  // onDragOver(event: DragEvent, index: number) {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   this.dragOverIndex = index;
  // }

  // onDragLeave(event: DragEvent) {
  //   this.dragOverIndex = null;
  // }

  // onDrop(event: DragEvent, dropIndex: number) {
  //   event.preventDefault();
  //   if (this.draggedIndex !== null && this.draggedIndex !== dropIndex) {
  //     const imageToMove = this.images[this.draggedIndex];
  //     this.images.splice(this.draggedIndex, 1);
  //     this.images.splice(dropIndex, 0, imageToMove);
  //   }
  //   this.draggedIndex = null;
  //   this.dragOverIndex = null;
  // }

  // getDragItemClass(index: number): string {
  //   if (this.dragOverIndex === index && this.draggedIndex !== index) {
  //     return this.draggedIndex! < index ? 'drag-over-after' : 'drag-over-before';
  //   }
  //   return '';
  // }

}
