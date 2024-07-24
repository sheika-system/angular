import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { IAmenidad } from '../../interfaces';

@Component({
  selector: 'app-amenidad',
  standalone: true,
  imports: [
    MatFormFieldModule, MatSelectModule, FormsModule, ReactiveFormsModule, CommonModule, 
    FormsModule],
  templateUrl: './amenidad.component.html',
  styleUrl: './amenidad.component.scss'
})
export class AmenidadComponent implements OnInit{

  amenidadesFormControl = new FormControl([]);

  selectedAmenidades: IAmenidad[] = [];
  readonly DESELECT_ALL_VALUE = 'deselect_all';

  @Input() amenidades: IAmenidad[] = [];

  @Output() amenidadesChange: EventEmitter<IAmenidad[]> = new EventEmitter<IAmenidad[]>();

  ngOnInit() {
    this.amenidadesFormControl.valueChanges.subscribe((selectedValues: (number | string)[] | null) => {
      if (selectedValues === null) {
        this.selectedAmenidades = [];
      } else if (selectedValues.includes(this.DESELECT_ALL_VALUE)) {
        // Si se seleccionó la opción "Remove selección"
        this.deselectAll();
      } else {
        // Filtrar las amenidades seleccionadas
        this.selectedAmenidades = this.amenidades.filter(amenidad => 
          selectedValues.includes(amenidad.amenidadId)
        );
        this.amenidadesChange.emit(this.selectedAmenidades);
      }
      
    });
  }

  trackByAmenidadId(index: number, amenidad: IAmenidad): number {
    return amenidad.amenidadId;
  }

  deselectAll() {
    this.amenidadesFormControl.setValue([]);
    this.amenidadesChange.emit([]);
  }

  

}
