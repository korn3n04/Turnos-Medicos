import { Request, Response } from 'express';
import { randomUUID } from 'node:crypto';
import { profesionales, especialidades } from '../data/dataManager';

// 1. Obtener todos los profesionales
export const getProfesionales = async (req: Request, res: Response): Promise<any> => {
  let status = 200;
  try {
    status = 200;
    return res.status(status).json({
      success: true,
      data: profesionales
    });
  } catch (error: any) {
    status = 500;
    return res.status(status).json({
      success: false,
      error: "Internal Server Error",
      message: error.message || "Error al obtener los profesionales"
    });
  }
};

// 2. Obtener profesional por ID
export const getProfesionalById = async (req: Request, res: Response): Promise<any> => {
  let status = 200;
  try {
    const { id } = req.params;

    // Validación previa
    if (!id) {
      status = 400;
      throw new Error("El ID del profesional es obligatorio.");
    }

    const profesional = profesionales.find(p => p.medicoId === id);

    if (!profesional) {
      status = 404;
      throw new Error("Profesional no encontrado.");
    }

    status = 200;
    return res.status(status).json({
      success: true,
      data: profesional
    });
  } catch (error: any) {
    return res.status(status === 200 ? 500 : status).json({
      success: false,
      error: status === 404 ? "Not Found" : "Bad Request",
      message: error.message
    });
  }
};

// 3. Registrar nuevo profesional (validando especialidad existente)
export const createProfesional = async (req: Request, res: Response): Promise<any> => {
  let status = 201;
  try {
    const { nombre, especialidad } = req.body;

    // Validaciones previas
    if (!nombre || typeof nombre !== 'string' || nombre.trim() === '') {
      status = 400;
      throw new Error("El campo 'nombre' es obligatorio y debe ser un texto válido.");
    }

    if (!especialidad || typeof especialidad !== 'string' || especialidad.trim() === '') {
      status = 400;
      throw new Error("El campo 'especialidad' es obligatorio.");
    }

    // Verificar que la especialidad exista y esté activa
    const especialidadExiste = especialidades.find(
      e => e.nombreEspecilidad.toLowerCase() === especialidad.trim().toLowerCase() && e.activa
    );

    if (!especialidadExiste) {
      status = 400;
      throw new Error("La especialidad indicada no existe en el sistema o no está activa.");
    }

    status = 201;
    const nuevoProfesional = {
      medicoId: randomUUID(),
      nombre: nombre.trim(),
      especialidad: especialidadExiste.nombreEspecilidad,
      activo: true
    };

    profesionales.push(nuevoProfesional);

    return res.status(status).json({
      success: true,
      message: "Profesional registrado con éxito",
      data: nuevoProfesional
    });
  } catch (error: any) {
    return res.status(status === 201 ? 500 : status).json({
      success: false,
      error: "Bad Request",
      message: error.message
    });
  }
};

// 4. Modificar profesional existente (PUT)
export const updateProfesional = async (req: Request, res: Response): Promise<any> => {
  let status = 200;
  try {
    const { id } = req.params;
    const { nombre, especialidad, activo } = req.body;

    if (!id) {
      status = 400;
      throw new Error("El ID del profesional es obligatorio.");
    }

    const profesional = profesionales.find(p => p.medicoId === id);

    if (!profesional) {
      status = 404;
      throw new Error("Profesional no encontrado.");
    }

    if (especialidad) {
      const especialidadExiste = especialidades.find(
        e => e.nombreEspecilidad.toLowerCase() === especialidad.trim().toLowerCase()
      );
      if (!especialidadExiste) {
        status = 400;
        throw new Error("La especialidad indicada no existe en el sistema.");
      }
      profesional.especialidad = especialidadExiste.nombreEspecilidad;
    }

    if (nombre !== undefined) {
      if (typeof nombre !== 'string' || nombre.trim() === '') {
        status = 400;
        throw new Error("El campo 'nombre' debe ser un texto válido.");
      }
      profesional.nombre = nombre.trim();
    }

    if (activo !== undefined) {
      if (typeof activo !== 'boolean') {
        status = 400;
        throw new Error("El campo 'activo' debe ser de tipo booleano (true/false).");
      }
      profesional.activo = activo;
    }

    status = 200;
    return res.status(status).json({
      success: true,
      message: "Profesional actualizado correctamente",
      data: profesional
    });
  } catch (error: any) {
    return res.status(status === 200 ? 500 : status).json({
      success: false,
      error: status === 404 ? "Not Found" : "Bad Request",
      message: error.message
    });
  }
};

// 5. Borrado lógico de profesional (Soft Delete)
export const deleteProfesional = async (req: Request, res: Response): Promise<any> => {
  let status = 200;
  try {
    const { id } = req.params;

    if (!id) {
      status = 400;
      throw new Error("El ID del profesional es obligatorio.");
    }

    const profesional = profesionales.find(p => p.medicoId === id);

    if (!profesional) {
      status = 404;
      throw new Error("Profesional no encontrado.");
    }

    profesional.activo = false;
    status = 200;

    return res.status(status).json({
      success: true,
      message: "Profesional desactivado correctamente",
      data: profesional
    });
  } catch (error: any) {
    return res.status(status === 200 ? 500 : status).json({
      success: false,
      error: status === 404 ? "Not Found" : "Bad Request",
      message: error.message
    });
  }
};