import { Request, Response } from 'express';

// Controlador para la ruta de bienvenida
export const getWelcome = async (req: Request, res: Response): Promise<any> => {
  let status = 200;
  try {
    status = 200;
    return res.status(status).json({
      success: true,
      message: "Bienvenido a TurnosMed API - Actividad 3 (Clean Architecture)"
    });
  } catch (error: any) {
    status = 500;
    return res.status(status).json({
      success: false,
      error: "Internal Server Error",
      message: error.message || "Error interno del servidor"
    });
  }
};

// Controlador / Middleware para rutas no encontradas (404)
export const handleNotFound = async (req: Request, res: Response): Promise<any> => {
  let status = 404;
  try {
    status = 404;
    throw new Error(`La ruta '${req.originalUrl}' no existe en la API de TurnosMed.`);
  } catch (error: any) {
    return res.status(status).json({
      success: false,
      error: "Not Found",
      message: error.message
    });
  }
};