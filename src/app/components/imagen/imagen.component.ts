import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IImagen, IPropiedad } from '../../interfaces';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { NgbCarouselModule, NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { ImagenModalComponent } from './imagen-modal/imagen-modal.component';

@Component({
  selector: 'app-imagen',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    NgbCarouselModule,
    NgbModalModule
  ],
  templateUrl: './imagen.component.html',
  styleUrls: ['./imagen.component.scss'],
})
export class ImagenComponent {

  @Input() listaImagenes: IImagen[] = [];

  @Input() verTabla: boolean = false;

  @Input() verCarousel: boolean = false;

  @Input() verRegistro: boolean = false;

  @Input() propiedadImagen: IPropiedad = {
    propiedadId: undefined,
    nombre: '',
    descripcion: '',
    tipoPropiedad: undefined,
    moneda: '',
    precio: 0,
    ubicacion: undefined
  }

  @Output() regImagenes: EventEmitter<IImagen[]> = new EventEmitter<IImagen[]>();

  imagenNueva: IImagen = {
    imagenId: undefined,
    descripcion: "",
    imagen: undefined,
    propiedad: this.propiedadImagen
  };

  imagenesRegistrar = [{ descripcion: '', imagen: '' }];
  lastAddedIndex = 0;
  imagesRegistered = false;
  newlyAddedIndex: number | null = null; 
  touchedFields: Set<number> = new Set();

  carouselConfig = {
    interval: 5000,
    wrap: true,
    keyboard: false,
    pauseOnHover: true
  };

  constructor(private modalService: NgbModal, private sanitizer: DomSanitizer) {
    
  }

  getImageUrl(imagen: IImagen): SafeUrl {
    if (imagen.imagen) {
      const imageDataUrl = `data:image/jpeg;base64,${imagen.imagen}`;
      return this.sanitizer.bypassSecurityTrustUrl(imageDataUrl);
    } else {
      return 'ruta/a/imagen/por/defecto.jpg';
    }
  }
  
  openModal(imagen: IImagen) {
    const modalRef = this.modalService.open(ImagenModalComponent, { size: 'xl' });
    modalRef.componentInstance.imagenUrl = this.getImageUrl(imagen);
    modalRef.componentInstance.descripcion = imagen.descripcion;
  }

  onFileChange(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const base64String = e.target.result.split(',')[1];
        this.imagenesRegistrar[index].imagen = base64String;
      };

      reader.readAsDataURL(file);
    }
  }

  addImage() {
    if (this.imagesRegistered) {
      this.imagesRegistered = false;
      this.newlyAddedIndex = null;
    } else {
      this.imagenesRegistrar.push({ descripcion: '', imagen: '' });
      this.lastAddedIndex = this.imagenesRegistrar.length - 1;
      this.newlyAddedIndex = this.lastAddedIndex;
    }
  }

  // removeImage(index: number, fileInput: any) {
  //   if (index !== -1) {
  //     this.imagenesRegistrar.splice(index, 1);
  //     this.touchedFields.delete(index);
  //     fileInput.value = '';
  //   }
  // }

  removeImage(index: number, fileInput: HTMLInputElement) {
    if (this.imagenesRegistrar.length > 1) {
      // Si hay más de un elemento, eliminar el control
      if (index >= 0 && index < this.imagenesRegistrar.length) {
        this.imagenesRegistrar.splice(index, 1);
        
        // Ajustar índices
        if (this.lastAddedIndex >= this.imagenesRegistrar.length) {
          this.lastAddedIndex = this.imagenesRegistrar.length - 1;
        }
        if (this.newlyAddedIndex === index) {
          this.newlyAddedIndex = null;
        }
        this.touchedFields.delete(index);
      }
    } else {
      // Si solo queda un elemento, limpiar los campos
      this.imagenesRegistrar[0].descripcion = '';
      this.imagenesRegistrar[0].imagen = '';
      this.touchedFields.clear();
    }
  
    // Restablecer el campo de archivo
    if (fileInput) {
      fileInput.value = '';
    }
  }
  registrarImagenes() {
    const invalidFields = this.imagenesRegistrar.some(
      img => !img.imagen
    );
  
    if (invalidFields) {
      this.imagenesRegistrar.forEach((img, index) => {
        if (!img.imagen) {
          this.touchedFields.add(index);
        }
      });
      return;
    }
  
    if (!this.imagesRegistered) {
      this.imagenesRegistrar.forEach(imagen => {
        this.imagenNueva = {
          ...this.imagenNueva,
          descripcion: imagen.descripcion,
          imagen: imagen.imagen,
          propiedad: this.propiedadImagen,
        };
        
      });
      
    }
  
    this.imagesRegistered = !this.imagesRegistered;
    this.newlyAddedIndex = null;
    // Aqui se encuentra la lista de las imagenes que se pueden registrar.
    //Se retorna al objeto padre la lista de imagenes
    // si no hay imagenes a registrar o el form esta invalido, no retornará nada
    this.regImagenes.emit(this.imagenesRegistrar);
  }
  
  getImagePreview(image: string): string {
    return `data:image/jpeg;base64,${image}`;
  }
  
  allFieldsValid(index: number, img: { descripcion: string; imagen: string }): boolean {
    return img.imagen !== '';
  }
  
  isFieldInvalid(index: number): boolean {
    const field = this.imagenesRegistrar[index];
    return this.touchedFields.has(index) && !field.imagen;
  }

  deleteImagen(imagen: IImagen){
    console.log(imagen.descripcion);
  }
}
