import { CalificacionUsuarioService } from '../../../../services/calificaion-usuario.service';

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, inject, input } from '@angular/core';
import { CalificacionUsuarioCardComponent } from '../../../calificacion-usuario-card/calificacion-usuario-card.component';
import { NgModel, NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { UserService } from '../../../../services/user.service';
import { ICalificacionUsuario } from '../../../../interfaces';

@Component({
  selector: 'app-calificacion-usuario',
  templateUrl: './calificacion-usuario.component.html',
  styleUrls: [ './calificacion-usuario.component.scss' ],
  standalone: true,
  imports: [CommonModule,CalificacionUsuarioCardComponent,FormsModule],
  
})
export class CalificacionUsuarioComponent  {
  public nombreUsuario: string="";
  public ImagenUsuario: string="";
  public editSuccess!: boolean;
  CalificacionUsuarioService = inject(CalificacionUsuarioService)
  public calificacionUsuario!: ICalificacionUsuario;
  @Input() nombre!: string;
  @Input() imagen!: string;
  @Input() calificacionPromedio!: number;
  @Input() usuarioCalificadoId!: string | null;
  @Input() usuarioCalificadorId!: string;
  
  comentario: string = "";

    stars: number[] = [1, 2, 3, 4, 5];
    selectedValue: number= 0;
  
    constructor(private userService: UserService) { }

    ngOnInit() {
      this.calificacionUsuario = {
        comentario: "",
        valor: 0,
      };
    }

    onSubmit(form: NgForm) {
      const userCalificadoId = parseInt(this.usuarioCalificadoId ?? '0', 10);
      const userCalificadorId = parseInt(this.usuarioCalificadorId ?? '0', 10);
      this.calificacionUsuario.comentario = form.value.comentario;
      this.calificacionUsuario.valor = this.selectedValue;
      if (!this.calificacionUsuario.usuarioCalificado && !this.calificacionUsuario.usuarioCalificador) {
        this.calificacionUsuario.usuarioCalificado = {id:userCalificadoId};
        this.calificacionUsuario.usuarioCalificador = {id:userCalificadorId};
      }
      console.log(this.calificacionUsuario)

      this.CalificacionUsuarioService.saveCalificacionUsuarioSignal(this.calificacionUsuario).subscribe({
        next: () => {
          this.editSuccess = true;
          setTimeout(function(){
            location.reload();
          }, 1000);
        }
    });
    }
    countStar(star: number) {
      this.selectedValue = star;
      console.log('Valor de la estrella', star);
    }
  }

  
