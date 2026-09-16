import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { especialidades } from '../data/dataManager';

// 1. Obtener todas las especialidades
export const getEspecialidades = async (req: Request, res: Response): Promise<any> => {
  let status = 200;
  try {
    status = 200;
    return res.status(status).json({
      success: true,
      data: especialidades
    });
  } catch (error: any) {
    status = 500;
    return res.status(status).json({
      success: false,
      error: "Internal Server Error",
      message: error.message || "Error al obtener las especialidades"
    });
  }
};

// 2. Obtener especialidad por ID
export const getEspecialidadById = async (req: Request, res: Response): Promise<any> => {
  let status = 200;
  try {
    const { id } = req.params;

    // Validación previa
    if (!id) {
      status = 400;
      throw new Error("El ID de la especialidad es obligatorio.");
    }

    const especialidad = especialidades.find(e => e.especialidadId === id);

    if (!especialidad) {
      status = 404;
      throw new Error("Especialidad no encontrada.");
    }

    status = 200;
    return res.status(status).json({
      success: true,
      data: especialidad
    });
  } catch (error: any) {
    return res.status(status === 200 ? 500 : status).json({
      success: false,
      error: status === 404 ? "Not Found" : "Bad Request",
      message: error.message
    });
  }
};

// 3. Crear nueva especialidad
export const createEspecialidad = async (req: Request, res: Response): Promise<any> => {
  let status = 201;
  try {
    const { nombreEspecilidad } = req.body;

    // Validación previa
    if (!nombreEspecilidad || typeof nombreEspecilidad !== 'string' || nombreEspecilidad.trim() === '') {
      status = 400;
      throw new Error("El campo 'nombreEspecilidad' es obligatorio y debe ser un texto válido.");
    }

    status = 201;
    const nuevaEspecialidad = {
      especialidadId: randomUUID(),
      nombreEspecilidad: nombreEspecilidad.trim(),
      activa: true
    };

    especialidades.push(nuevaEspecialidad);

    return res.status(status).json({
      success: true,
      message: "Especialidad creada con éxito",
      data: nuevaEspecialidad
    });
  } catch (error: any) {
    return res.status(status === 201 ? 500 : status).json({
      success: false,
      error: "Bad Request",
      message: error.message
    });
  }
};

// 4. Borrado lógico de especialidad (Soft Delete)
export const deleteEspecialidad = async (req: Request, res: Response): Promise<any> => {
  let status = 200;
  try {
    const { id } = req.params;

    // Validación previa
    if (!id) {
      status = 400;
      throw new Error("El ID de la especialidad es obligatorio.");
    }

    const especialidad = especialidades.find(e => e.especialidadId === id);

    if (!especialidad) {
      status = 404;
      throw new Error("Especialidad no encontrada.");
    }

    especialidad.activa = false;
    status = 200;

    return res.status(status).json({
      success: true,
      message: "Especialidad desactivada correctamente",
      data: especialidad
    });
  } catch (error: any) {
    return res.status(status === 200 ? 500 : status).json({
      success: false,
      error: status === 404 ? "Not Found" : "Bad Request",
      message: error.message
    });
  }
};