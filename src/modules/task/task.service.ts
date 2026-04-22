import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../../services/prisma.service';

@Injectable()
export class TaskService {
  constructor(private prisma: PrismaService) { }

  async getTasks(currentUser: any): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      where: { user_id: currentUser.sub } // <-- Cambiado a .sub
    });
    return tasks as Task[];
  }

  async getTaskById(id: number, currentUser: any): Promise<Task | null> {
    const task = await this.prisma.task.findFirst({
      where: {
        id,
        user_id: currentUser.sub // <-- Cambiado a .sub
      },
    });

    if (!task) throw new NotFoundException(`Tarea no encontrada o no tienes permisos`);

    return task as Task;
  }

  async insertTask(taskDto: CreateTaskDto, currentUser: any): Promise<Task> {
    
    // 🔥 AGREGA ESTA LÍNEA PARA VER QUÉ HAY DENTRO DEL TOKEN 🔥
    console.log("=== DATOS DEL CURRENT USER ===", currentUser);

    const newTask = await this.prisma.task.create({
      data: {
        name: taskDto.name as string,
        description: taskDto.description as string,
        priority: taskDto.priority as boolean,
        user_id: currentUser.sub, // O quizá es currentUser.id, lo sabremos con el console.log
      },
    });

    return newTask as Task;
  }

  async updateTask(id: number, taskUpdate: UpdateTaskDto, currentUser: any): Promise<Task> {
    const existingTask = await this.prisma.task.findFirst({
      where: { id, user_id: currentUser.sub }, // <-- Cambiado a .sub
    });

    if (!existingTask) throw new NotFoundException(`Tarea no encontrada o no tienes permisos`);

    // Usamos el DTO directamente para actualizar
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: taskUpdate,
    });

    return updatedTask as Task;
  }

  async deleteTask(id: number, currentUser: any): Promise<Task> {
    const existingTask = await this.prisma.task.findFirst({
      where: { id, user_id: currentUser.sub }, // <-- Cambiado a .sub
    });

    if (!existingTask) throw new NotFoundException(`Tarea no encontrada o no tienes permisos`);

    const deletedTask = await this.prisma.task.delete({
      where: { id },
    });

    return deletedTask as Task;
  }
}
