import { Component, effect, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropiedadService } from '../../services/propiedad.service';
import { IPropiedad, IImagen, IRecorrido3D } from '../../interfaces';
import { ImagenComponent } from '../../components/imagen/imagen.component';
import { ImagenModalComponent } from '../../components/imagen/imagen-modal/imagen-modal.component';
import { CommonModule } from '@angular/common';
import { BtnInicioComponent } from '../../components/btn-inicio/btn-inicio.component';
import { Recorrido3dFormComponent } from "../../components/recorrido3d/recorrido3d-form/recorrido3d-form.component";
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Recorrido3dVisorComponent } from "../../components/recorrido3d/recorrido3d-visor/recorrido3d-visor.component";
import { Recorrido3dService } from '@app/services/recorrido3d.service';

@Component({
  selector: 'app-propiedad',
  standalone: true,
  imports: [ImagenComponent, 
    ImagenModalComponent, CommonModule, 
    BtnInicioComponent, Recorrido3dFormComponent, 
    Recorrido3dVisorComponent,
    Recorrido3dVisorComponent],
  templateUrl: './detalle-propiedad.component.html',
  styleUrl: './detalle-propiedad.component.scss',
  animations: [
    trigger('slideInOut', [
      state('true', style({
        height: '*',
        opacity: 1,
        overflow: 'hidden'
      })),
      state('false', style({
        height: '0px',
        opacity: 0,
        overflow: 'hidden',
      })),
      transition('false <=> true', animate('300ms ease-in-out'))
    ])
  ]
})
export class PropiedadDetalleComponent implements OnInit{
  protected propiedadId: number;
  recorrido3d: IRecorrido3D | null = null;
  listaImagenes: IImagen[] = [];
  protected propiedad: IPropiedad = {
    listaImagenes: this.listaImagenes
  };
  verRecorrido3DForm = false;
  verVisorRecorrido3D = false;
  verRecorrido3dFormInvalid = true;
  verRecorrido3dInvalid = true;
  panoramaReady = false;
  recorrido3dExiste: boolean = false;
  currentUserId: number | undefined;
  esPropietario: boolean = false;

  private service = inject(PropiedadService);
  recorrido3dService = inject(Recorrido3dService)
  
  constructor(private route: ActivatedRoute) {
    this.propiedadId = parseInt(this.route.snapshot.paramMap.get('id') ?? '0', 10);
    this.loadCurrentUser();

    effect(() => {
      const propiedadSignal = this.service.propiedad$;
      if (propiedadSignal) {
        this.propiedad = propiedadSignal();
        this.checkEsPropietario();
        if (this.propiedadId) {
          this.loadRecorrido3d();
        }
      }
    });

    effect(() => {
      const recorrido = this.recorrido3dService.recorrido3dRegistrado$();
      this.recorrido3d = recorrido;
      this.recorrido3dExiste = !!recorrido && !!recorrido.recorrido3dId;
      this.updateButtonStates();
    });
    
  }

  
  ngOnInit(): void {
    if (this.propiedadId !== null) {
      this.service.getByIdSignal(this.propiedadId);
    }
  }

  private loadCurrentUser(): void {
    const user = localStorage.getItem('auth_user');
    if (user) {
      this.currentUserId = JSON.parse(user)?.id;
    }
  }

  private checkEsPropietario(): void {
    this.esPropietario = this.currentUserId === this.propiedad.user?.id;
  }

  private updateButtonStates(): void {
    this.verRecorrido3dFormInvalid = this.esPropietario && this.recorrido3dExiste;
    this.verRecorrido3dInvalid = !this.recorrido3dExiste;
    
    if (this.esPropietario && !this.recorrido3dExiste) {
      this.verRecorrido3DForm = true;
    } else {
      this.verRecorrido3DForm = false;
    }
  }

  toggleRecorrido3DForm(): void {
    if (!this.verRecorrido3dFormInvalid) {
      this.verVisorRecorrido3D = false;
      this.verRecorrido3DForm = !this.verRecorrido3DForm;
    }
  }

  toggleVisorRecorrido3D(): void {
    if (!this.verRecorrido3dInvalid) {
      this.verRecorrido3DForm = false;
      this.verVisorRecorrido3D = !this.verVisorRecorrido3D;
    }
  }

  loadRecorrido3d(): void {
    if (this.propiedadId) {
      this.recorrido3dService.getByIdSignal(this.propiedadId);
    }
  }

  mostrarPanorama(panoramaReady: boolean){
    this.panoramaReady = panoramaReady
    // console.log("this.panoramaReady", this.panoramaReady);
  }

  mostrarRecorrido3dCreado(recorrido3d: IRecorrido3D) {
    if (recorrido3d && recorrido3d.recorrido3dId) {
      this.recorrido3d = recorrido3d;
      this.recorrido3dService.setRecorrido3d(recorrido3d); // Asegúrate de que este método exista en tu servicio
      this.verVisorRecorrido3D = true;
      // Asegúrate de que el estado se actualice completamente antes de mostrar el visor
      setTimeout(() => {
        this.updateButtonStates();
      }, 0);
    } else {
      console.error('Recorrido3D creado no válido:', recorrido3d);
    }
  }

  manejarEliminacionRecorrido3D() {
    this.recorrido3d = null;
    this.verVisorRecorrido3D = false;
    this.recorrido3dService.clearRecorrido3d(); // Asegúrate de que este método exista en tu servicio
    this.updateButtonStates();
  }

}
