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

export interface ICalificacionUsuario{
  id?: number;
  usuarioCalificado?: IUser;
  usuarioCalificador?: IUser;
  valor?: number;
  fecha?: Date;
  comentario?: string;
}
export interface ICalificacionPropiedad{	
  id?: number;
  propiedadCalificada?: IPropiedad;
  usuarioCalificador?: IUser;
  valor?: number;
  fecha?: Date;
  comentario?: string;
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


export interface IAmenidad {
  amenidadId: number;
  nombre: string;
}

export interface ITipoPropiedad {

  tipoPropiedadId?: number;
  nombre?: string;

}

export interface IImagen{
  imagenId?: number,
  descripcion?: string,
  imagen?: string;
  propiedad?: IPropiedad

}

export interface IPropiedad {
  propiedadId?: number;
  nombre?: string;
  descripcion?: string;
  tipoPropiedad?: ITipoPropiedad;
  moneda?: string;
  precio?: number;
  ubicacion?: IUbicacion;
  amenidades?: IAmenidad[];
  annioConstruccion?: number;
  cuartosCant?: number;
  banniosCant?: number;
  metrosCuadrados?: number;
  disponibilidad?: boolean;
  listaImagenes?: IImagen[];
  user?: IUser;
}

export interface IDelito {
  delito: string;
  subdelito: string;
  fecha: Date;
  hora: string;
  victima: string;
  subvictima: string;
  edad: number;
  sexo: string;
  nacionalidad: string;
  provincia: string;
  canton: string;
  distrito: string;
}

export interface PagedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
    sort: {
      empty: boolean;
      sorted: boolean;
      unsorted: boolean;
    };
    offset: number;
    paged: boolean;
  };
  last: boolean;
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: {
    empty: boolean;
    sorted: boolean;
    unsorted: boolean;
  };
  first: boolean;
  numberOfElements: number;
  empty: boolean;
}


export interface IRecorrido3D {
  recorrido3dId?: number;
  nombre: string;
  descripcion: string;
  archivoRecorrido?: string;
  imagenes?: IImagen[];
  fechaCreacion?: Date;
  propiedad?: IPropiedad;
}

export interface TourConfig {
  firstScene: string;
  scenes: {
    [key: string]: Scene;
  };
}

export interface Scene {
  imageId: number;
  title: string;
}
export interface ICurrency {
  value: string,
  viewValue: string

}

export interface IPuntoInteres {
  puntoInteresId?: number,
  nombre?: string,
  posicionX?: number,
  posicionY?: number,
  recorrido3dId?: number,
  escenaId: string;
}
export interface IRenta {
  rentaId?: number;
  estado?: string;
  comentario?: string;
  fechaInicio?: Date;
  fechaFin?: Date;
  fechaCreacion?: Date;
  fechaModificacion?: Date;
  propiedad?: IPropiedad;
  user?: IUser;
}

export interface IMensaje {
  mensajeId?: number,
  emisor?: IUser,
  receptor?: IUser,
  texto?: string
}
