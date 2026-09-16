import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { setEspecialidades, setProfesionales } from './data/dataManager';
import { getWelcome, handleNotFound } from './controllers/generalController';
import * as espController from './controllers/especialidadesController';
import * as profController from './controllers/profesionalesController';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON en las peticiones
app.use(express.json());

// Cargar datos iniciales desde los archivos JSON hacia la memoria (dataManager)
try {
  const espDataPath = path.join(__dirname, 'Data', 'Especialidades.json');
  const profDataPath = path.join(__dirname, 'Data', 'Profecionales.json');

  if (fs.existsSync(espDataPath)) {
    const espRaw = fs.readFileSync(espDataPath, 'utf-8');
    setEspecialidades(JSON.parse(espRaw));
    console.log('✔ Especialidades cargadas correctamente en memoria.');
  }

  if (fs.existsSync(profDataPath)) {
    const profRaw = fs.readFileSync(profDataPath, 'utf-8');
    setProfesionales(JSON.parse(profRaw));
    console.log('✔ Profesionales cargados correctamente en memoria.');
  }
} catch (error) {
  console.error('Error al cargar los datos iniciales:', error);
}

// ==========================================
// RUTAS DE LA API (Clean Architecture)
// ==========================================

// Ruta de bienvenida (General Controller)
app.get('/', getWelcome);

// Rutas de Especialidades
app.get('/especialidades', espController.getEspecialidades);
app.get('/especialidades/:id', espController.getEspecialidadById);
app.post('/especialidades', espController.createEspecialidad);
app.delete('/especialidades/:id', espController.deleteEspecialidad);

// Rutas de Profesionales
app.get('/profesionales', profController.getProfesionales);
app.get('/profesionales/:id', profController.getProfesionalById);
app.post('/profesionales', profController.createProfesional);
app.put('/profesionales/:id', profController.updateProfesional);
app.delete('/profesionales/:id', profController.deleteProfesional);

// ==========================================
// MIDDLEWARE 404 (Debe ir al final de todas las rutas)
// ==========================================
app.use(handleNotFound);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor de TurnosMed corriendo en http://localhost:${PORT}`);
});