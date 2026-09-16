export interface Especialidad {
  especialidadId: string;
  nombreEspecilidad: string;
  activa: boolean;
}

export interface Profesional {
  medicoId: string;
  nombre: string;
  especialidad: string;
  activo: boolean;
}

// Arrays globales compartidos
export let especialidades: Especialidad[] = [];
export let profesionales: Profesional[] = [];

// Funciones para actualizar los datos tras leer los JSON
export const setEspecialidades = (data: Especialidad[]): void => {
  especialidades = data;
};

export const setProfesionales = (data: Profesional[]): void => {
  profesionales = data;
};