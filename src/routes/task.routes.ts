import { Router } from 'express';
import { TaskController } from '../controllers/task.controller.js';

const router = Router();

// Rutas de tareas
router.get('/', TaskController.getAllTasks);
router.post('/', TaskController.createTask);
router.put('/:id', TaskController.updateTask);
router.patch('/:id/toggle', TaskController.toggleTaskStatus);
router.delete('/:id', TaskController.deleteTask);

export default router;