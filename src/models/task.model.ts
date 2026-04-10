import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const taskSchema = new Schema<ITask>(
  {
    title: {
      type: String,
      required: [true, 'El título es requerido'],
      trim: true,
      minlength: [1, 'El título debe tener al menos 1 carácter'],
      maxlength: [100, 'El título no puede exceder los 100 caracteres']
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'La descripción no puede exceder los 500 caracteres']
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
);

// Índices para mejorar el rendimiento
taskSchema.index({ createdAt: -1 });
taskSchema.index({ completed: 1 });

export const Task = mongoose.model<ITask>('Task', taskSchema);