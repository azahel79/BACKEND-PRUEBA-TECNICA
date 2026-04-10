import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/task.routes.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';
import { connectDB } from './config/database.js';

// Configurar variables de entorno
dotenv.config();

// Crear la app
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Rutas
app.use('/api/tasks', taskRoutes);

// Manejo de rutas no encontradas
app.use(notFound);

// Manejo de errores
app.use(errorHandler);

// Conectar a la base de datos
connectDB();

// Forzamos a que PORT sea un número usando Number()
const PORT = Number(process.env.PORT) || 10000;

// 1. Asignamos app.listen a la variable 'server' para que 'server.close' funcione
// 2. Al ser PORT un número claro, el error de "overload" desaparece
const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

// Manejo de cierre graceful
process.on('SIGTERM', () => {
    server.close(() => {
        console.log('Servidor cerrado');
        process.exit(0);
    });
});


export default app;