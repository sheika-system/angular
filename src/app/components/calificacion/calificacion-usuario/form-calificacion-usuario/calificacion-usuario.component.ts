import { CalificacionUsuarioService } from './../../../../services/calificacion-usuario.service';

import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, inject, input } from '@angular/core';
import { CalificacionUsuarioCardComponent } from '../../../calificacion-usuario-card/calificacion-usuario-card.component';
import { NgModel, NgForm, FormsModule, ReactiveFormsModule } from '@angular/forms'
import { UserService } from '../../../../services/user.service';
import { ICalificacionUsuario } from '../../../../interfaces';

@Component({
  selector: 'my-app',
  templateUrl: './calificacion-usuario.component.html',
  styleUrls: [ './calificacion-usuario.component.scss' ],
  standalone: true,
  imports: [CommonModule,CalificacionUsuarioCardComponent,FormsModule],
  
})
export class CalificacionUsuarioComponent  {
  public nombreUsuario: string=""
  public ImagenUsuario: string=""
  public editSuccess!: boolean;
  CalificacionUsuarioService = inject(CalificacionUsuarioService)
  public calificacionUsuario!: ICalificacionUsuario;
  @Input() nombre!: string;
  @Input() imagen!: string;
  @Input() calificacionPromedio!: number;
  comment: string = '';

    stars: number[] = [1, 2, 3, 4, 5];
    selectedValue: number= 0;
  
    constructor(private userService: UserService) { }
    
    ngOnInit() {
    }
    onSubmit(form: NgForm) {
      this.calificacionUsuario.comentario = form.value.comentario;
      this.calificacionUsuario.valor = this.selectedValue;
      console.log(form.value);
      console.log('Comentario:', this.calificacionUsuario.comentario);
      console.log('Calificación seleccionada:', this.calificacionUsuario.valor);
     this.CalificacionUsuarioService.updateCalificacionUsuarioSignal(this.calificacionUsuario).subscribe({
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

  