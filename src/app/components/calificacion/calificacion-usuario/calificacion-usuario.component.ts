
import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, OnInit, inject, input } from '@angular/core';
import { CalificacionUsuarioCardComponent } from '../../calificacion-usuario-card/calificacion-usuario-card.component';
import { NgModel, NgForm, FormsModule } from '@angular/forms'

@Component({
  selector: 'my-app',
  templateUrl: './calificacion-usuario.component.html',
  styleUrls: [ './calificacion-usuario.component.scss' ],
  standalone: true,
  imports: [CommonModule, CalificacionUsuarioCardComponent,FormsModule],
  
})
export class CalificacionUsuarioComponent  {
  public nombreUsuario: string=""
  public ImagenUsuario: string=""
  @Input() nombre!: string;
  @Input() imagen!: string;
  @Input() calificacionPromedio!: number;
  comment: string = '';

  onSubmit() {
    console.log('Comment:', this.comment);
  }

    stars: number[] = [1, 2, 3, 4, 5];
    selectedValue: number= 0;
  
    constructor() { }
    
    ngOnInit() {
    }
    
    countStar(star: any) {
      this.selectedValue = star;
      console.log('Value of star', star);
    }
}
