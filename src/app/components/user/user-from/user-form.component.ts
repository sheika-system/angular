import { Component, Input, ViewChild, inject } from '@angular/core';
import { IFeedBackMessage, IUser, IFeedbackStatus} from '../../../interfaces';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel,NgForm } from '@angular/forms'; 
import { UserService } from '../../../services/user.service';


@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})

export class UserFormComponent {
  @Input() title!: string;
  @Input() user: IUser = {
    email: '',
    nombre: '',
    apellido: '',
    password: '',
    ubicacion_id: 0,
    photo: undefined 

  };
  @Input() action: string = 'add'
  service = inject(UserService);
  feedbackMessage: IFeedBackMessage = {type: IFeedbackStatus.default, message: ''};

  handleAction (form: NgForm) {
    if (form.invalid) {
      Object.keys(form.controls).forEach(controlName => {
        form.controls[controlName].markAsTouched();
      });
      return;
    }else {
      const formData = new FormData();
      formData.append('file', this.user.photo as File);
      formData.append('userId', this.user.id as unknown as string); 

      this.service.uploadPhoto(formData).subscribe({
        next: () => {
          this.feedbackMessage.type = IFeedbackStatus.success;
          this.feedbackMessage.message = `User successfully; ${this.action == 'add' ? 'added' : 'updated'}`;
        },
        error: (error: any) => {
          this.feedbackMessage.type = IFeedbackStatus.error;
          this.feedbackMessage.message = error.message;
        }
      });
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.user.photo = event.target.files[0];
    }
  }
}