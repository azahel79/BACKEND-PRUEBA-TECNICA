import {type Request, type Response } from 'express';
import { Task } from '../models/task.model.js';
import type { ITask } from '../types/task.types.js';

export class TaskController {
  // Obtener todas las tareas
  static async getAllTasks(req: Request, res: Response): Promise<void> {
    try {
      const tasks = await Task.find().sort({ createdAt: -1 });
      res.json({
        success: true,
        count: tasks.length,
        data: tasks
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener las tareas',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Crear una nueva tarea
  static async createTask(req: Request, res: Response): Promise<void> {
    try {
      const { title, description } = req.body;

      if (!title) {
        res.status(400).json({
          success: false,
          message: 'El título es requerido'
        });
        return;
      }

      const newTask = new Task({ title, description });
      const savedTask = await newTask.save();
      
      res.status(201).json({
        success: true,
        data: savedTask,
        message: 'Tarea creada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error al crear la tarea',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Actualizar una tarea completa
  static async updateTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { title, description, completed } = req.body;

      const updateData: Partial<ITask> = {};
      if (title !== undefined) updateData.title = title;
      if (description !== undefined) updateData.description = description;
      if (completed !== undefined) updateData.completed = completed;

      const updatedTask = await Task.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!updatedTask) {
        res.status(404).json({
          success: false,
          message: 'Tarea no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        data: updatedTask,
        message: 'Tarea actualizada exitosamente'
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: 'Error al actualizar la tarea',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // Cambiar el estado de una tarea
static async toggleTaskStatus(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { completed } = req.body;

    // Validar que completed sea booleano si viene en el body
    if (completed !== undefined && typeof completed !== 'boolean') {
      res.status(400).json({
        success: false,
        message: 'El campo completed debe ser booleano'
      });
      return;
    }

    let updatedTask;

    if (completed !== undefined) {
      updatedTask = await Task.findByIdAndUpdate(
        id,
        { completed },
        { new: true, runValidators: true }
      );
    } else {
      const task = await Task.findById(id);
      if (!task) {
        res.status(404).json({
          success: false,
          message: 'Tarea no encontrada'
        });
        return;
      }
      task.completed = !task.completed;
      updatedTask = await task.save();
    }

    if (!updatedTask) {
      res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
      return;
    }

    //  Devolver directamente la tarea (sin wrapper)
    res.json(updatedTask);
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el estado',
      error: error instanceof Error ? error.message : 'Error desconocido'
    });
  }
}

  // Eliminar una tarea
  static async deleteTask(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deletedTask = await Task.findByIdAndDelete(id);

      if (!deletedTask) {
        res.status(404).json({
          success: false,
          message: 'Tarea no encontrada'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Tarea eliminada correctamente',
        data: { id: deletedTask._id }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar la tarea',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}