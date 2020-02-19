export interface Pais {
  ID: number;
  Nombre: string;
}
export interface Ciudad {
  ID: number;
  Nombre: string;
}
export interface Ubicacion {
  Pais: Pais;
  Ciudad: Ciudad;
}
export interface Persona {
  ID: number;
  Nombre: string;
  Apellido: string;
  Email: string;
  Celular: string;
  Ubicacion: Ubicacion;
}
export interface Usuario {
  Persona: Persona;
}
export interface Contacto {
  Persona: Persona;
  Estado: boolean;
}
export interface GuardarCorreo {
  Fecha: string;
  Titulo: string;
  Mensaje: string;
  TipoArchivo: string;
  Emisor: number;
  Receptor: string;
}
export interface Correo {
  ID: number;
  Fecha: string;
  Titulo: string;
  Mensaje: string;
  TipoArchivo: string;
  Receptor: string;
}

export interface VisualizarCorreo {
  ID: number;
  Fecha: string;
  Emisor: string;
  Titulo: string;
  Mensaje: string;
  TipoArchivo: string;
  Receptor: string;
}

export interface Receptor {
  ID: number;
  Email: string;
}
