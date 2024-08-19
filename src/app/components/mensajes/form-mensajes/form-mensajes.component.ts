import { CommonModule } from '@angular/common';
import { Component, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IMensaje, IUser } from '../../../interfaces';
import { MensajesService } from '../../../services/mensajes.service';

@Component({
  selector: 'app-form-mensajes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './form-mensajes.component.html',
  styleUrl: './form-mensajes.component.scss'
})
export class FormMensajesComponent {
  @Input() emisor: number | undefined;
  @Input() receptor: number | undefined;
  @Input() name: string | undefined;
  public sendSuccess!: boolean;
  public sendFailed!: boolean;

  mensajeForm!: FormGroup;
  private mensajeService = inject(MensajesService);
  enviado: boolean = false;

  constructor(private fb: FormBuilder) {
    this.mensajeForm = this.fb.group({
      contenido: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.mensajeForm) {
      if(String(this.mensajeForm.value.contenido) !== "") {
        const mensaje: IMensaje = {
          emisor: {
            id: this.emisor
          },
          receptor: {
            id: this.receptor
          },
          texto: String(this.mensajeForm.value.contenido),
        };
        this.sendSuccess = true;
        this.sendFailed = false
        console.log(mensaje)
  
        this.mensajeService.add(mensaje).subscribe({
          next: () => {
            this.enviado = true;
            this.mensajeForm.reset();
            setTimeout(() => {
              location.reload();
            }, 3000);
          },
          error: (err: any) => console.error('Error enviando mensaje:', err)
        });
      } else {
        this.sendFailed = true;
      } 
    }
  }
}
