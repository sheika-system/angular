import { Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IUser } from '../interfaces';
import { Observable, catchError, tap, throwError } from 'rxjs';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root',
})
export class UserService extends BaseService<IUser> {
  protected override source: string = 'users';
  protected baseUrl: string = 'http://localhost:4200';
  userListSignal = signal<IUser[]>([]);
  private userSignal = signal<IUser>({});
  
  get users$() {
    return this.userListSignal;
  }

  get user$() {
    return this.userSignal;
  }
  
  getAllSignal() {
    this.findAll().subscribe({
      next: (response: any) => {
        response.reverse();
        this.userListSignal.set(response);
      },
      error: (error: any) => {
        console.error('Error fetching users', error);
      }
    });
  }

  getByIdSignal(id: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.find(id).subscribe({
        next: (response: any) => {
          this.userSignal.set(response);
          resolve();
        },
        error: (error: any) => {
          console.error('Error fetching user', error);
          reject(error);
        }
      });
    });
  }
  
  saveUserSignal(user: IUser): Observable<any> {
    return this.add(user).pipe(
      tap((response: any) => {
        this.userListSignal.update(users => [response, ...users]);
      }),
      catchError(error => {
        console.error('Error saving user', error);
        return throwError(error);
      })
    );
  }
  
  updateUserSignal(user: IUser): Observable<any> {
    return this.edit(user.id, user).pipe(
      tap((response: any) => {
        const updatedUsers = this.userListSignal().map(u => u.id === user.id ? response : u);
        this.userListSignal.set(updatedUsers);
      }),
      catchError(error => {
        console.error('Error updating user', error);
        return throwError(error);
      })
    );
  }
  
  deleteUserSignal(id: number): Observable<any> {
    return this.del(id).pipe(
      tap((response: any) => {
        const updatedUsers = this.userListSignal().filter(u => u.id !== id);
        this.userListSignal.set(updatedUsers);
      }),
      catchError(error => {
        console.error('Error deleting user', error);
        return throwError(error);
      })
    );
  }
  
  uploadPhoto(formData: FormData): Observable<any> {
    return this.http.post(`${this.baseUrl}/${this.source}/uploadPhoto`, formData).pipe(
      tap((response: any) => {
        console.log('Photo uploaded successfully', response);
      }),
      catchError(error => {
        console.error('Error uploading photo', error);
        return throwError(error);
      })
    );
  }
}
