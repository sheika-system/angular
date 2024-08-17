import { CommonModule } from "@angular/common";
import { Component, inject, Input } from "@angular/core";

import { FormsModule, NgForm } from "@angular/forms";
import { CalificacionPropiedadService } from "../../../services/calificacion-propiedad.service";
import { ICalificacionPropiedad } from "../../../interfaces";
import { UserService } from "../../../services/user.service";
import { CalificacionPropiedadCardComponent } from "../../calificacion-propiedad-card/calificacion-propiedad-card.component";



@Component({
  selector: 'app-calificacion-propiedad',
  templateUrl: './calificacion-propiedad.component.html',
  styleUrls: [ './calificacion-propiedad.component.scss' ],
  standalone: true,
  
  imports: [CommonModule,CalificacionPropiedadCardComponent,FormsModule],
  
})
export class CalificacionPropiedadComponent  {
  public nombreUsuario: string="";
  public ImagenUsuario: string="";
  public editSuccess!: boolean;
  CalificacionPropiedadService = inject(CalificacionPropiedadService)
  public calificacionPropiedad!: ICalificacionPropiedad;
  @Input() nombre!: string;
  @Input() imagen!: string;
  @Input() calificacionPromedio!: number;
  @Input() usuarioCalificadorId!: string;
  @Input() propiedadCalificadaId!: string;
  
  comentario: string = "";

    stars: number[] = [1, 2, 3, 4, 5];
    selectedValue: number= 0;
  
    constructor(private userService: UserService) { }

    ngOnInit() {
      this.calificacionPropiedad = {
        comentario: "",
        valor: 0,
      };
    }

    onSubmit(form: NgForm) {
      const propiedadCalificadaId = parseInt(this.propiedadCalificadaId ?? '0', 10);
      const userCalificadorId = parseInt(this.usuarioCalificadorId ?? '0', 10);
      this.calificacionPropiedad.comentario = form.value.comentario;
      this.calificacionPropiedad.valor = this.selectedValue;
      if (!this.calificacionPropiedad.propiedadCalificada && !this.calificacionPropiedad.usuarioCalificador) {
        this.calificacionPropiedad.propiedadCalificada = {propiedadId:propiedadCalificadaId};
        this.calificacionPropiedad.usuarioCalificador = {id:userCalificadorId};
      }
      console.log(this.calificacionPropiedad)

      this.CalificacionPropiedadService.saveCalificacionPropiedadSignal(this.calificacionPropiedad).subscribe({
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

  
