export interface ILoginResponse {
  accessToken: string;
  expiresIn: number
}

export interface IResponse<T> {
  data: T;
}

export interface IUser {
  id?: number;
  nombre?: string;
  apellido?: string;
  email?: string;
  password?: string;
  createdAt?: string;
  updatedAt?: string;
  authorities?: IAuthority[];
  ubicacion?: IUbicacion;
  photo?: File;
}

export interface IAuthority {
  authority: string;
}

export interface IFeedBackMessage {
  type?: IFeedbackStatus;
  message?: string;
}

export enum IFeedbackStatus {
  success = "SUCCESS",
  error = "ERROR",
  default = ''
}

export enum IRole {
  admin = "ROLE_ADMIN",
  user = "ROLE_USER",
  superAdmin = 'ROLE_SUPER_ADMIN'
}

export interface IProvincia {
  provinciaId?: number;
  nombre: string;
}

export interface ICanton {
  cantonId?: number;
  nombre: string;
  provincia?: IProvincia;
}

export interface IDistrito {
  distritoId?: number;
  nombre: string;
  canton?: ICanton
}

export interface IUbicacion {
  ubicacionId?: number;
  provincia?: IProvincia;
  canton?: ICanton;
  distrito?: IDistrito;
  direccion?: string;
  latitud?: number;
  longitud?: number;
}

export interface IResetPasswordToken {
  id?: number;
  token?: string;
  user?: IUser;
  expiryDate?: Date;
}

export interface IResetPasswordRequest {
  newPassword?: string;
}

export interface ICalificacionUsuario{
  id?: number;
  usuarioCalificadoid?: IUser;
  usuarioCalificadorid?: IUser;
  valor?: number;
  fecha?: Date;
  comentario?: string;
}