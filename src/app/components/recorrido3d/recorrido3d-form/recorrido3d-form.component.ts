import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IRecorrido3D } from '@app/interfaces';
import { Recorrido3dService } from '@app/services/recorrido3d.service';

@Component({
  selector: 'app-recorrido3d-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recorrido3d-form.component.html',
  styleUrl: './recorrido3d-form.component.scss'
})
export class Recorrido3dFormComponent {
  @Input() propiedadId: number = 0;
  recorrido3d: IRecorrido3D | null = null;
  @Output() generateRecorrido3d: EventEmitter<IRecorrido3D> = new EventEmitter<IRecorrido3D>(); 

  recorrido3dService = inject(Recorrido3dService);
  images: {file: File, url: string}[] = [];
  draggedIndex: number | null = null;
  dragOverIndex: number | null = null;
  nombre: string = '';
  descripcion: string = '';
  
  isFormValid(): boolean {
    return this.nombre.trim().length > 0 && this.images.length > 0;
  }

  onFileSelected(event: any) {
    const files = event.target.files;
    for (let file of files) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.images.push({ file: file, url: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(index: number) {
    this.images.splice(index, 1);
  }

  createTour() {
    if (!this.isFormValid()) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    const files = this.images.map(img => img.file);

    // this.propiedadId = "5";
    
    this.recorrido3dService.saveRecorrido3D(files, this.nombre, this.descripcion, this.propiedadId.toString())
      .subscribe({
        next: (response) => {
          this.recorrido3d = response;
          console.log('Recorrido 3D creado:', this.recorrido3d);
          if(this.recorrido3d !== null){
            this.generateRecorrido3d.emit(this.recorrido3d);
          }else{
            console.error('Error al crear el recorrido 3D');
          }
          setTimeout(() => {
            console.log('Llamando a initPanellum');
            // this.initPanellum();
          }, 0);
        },
        error: (error) => {
          console.error('Error al crear el recorrido 3D:', error);
        }
      });
  }

  onDragStart(event: DragEvent, index: number) {
    this.draggedIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', index.toString());
    }
  }

  onDragOver(event: DragEvent, index: number) {
    event.preventDefault();
    event.stopPropagation();
    this.dragOverIndex = index;
  }

  onDragLeave(event: DragEvent) {
    this.dragOverIndex = null;
  }

  onDrop(event: DragEvent, dropIndex: number) {
    event.preventDefault();
    if (this.draggedIndex !== null && this.draggedIndex !== dropIndex) {
      const imageToMove = this.images[this.draggedIndex];
      this.images.splice(this.draggedIndex, 1);
      this.images.splice(dropIndex, 0, imageToMove);
    }
    this.draggedIndex = null;
    this.dragOverIndex = null;
  }

  getDragItemClass(index: number): string {
    if (this.dragOverIndex === index && this.draggedIndex !== index) {
      return this.draggedIndex! < index ? 'drag-over-after' : 'drag-over-before';
    }
    return '';
  }

}
