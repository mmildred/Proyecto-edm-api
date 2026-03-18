import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class TaskService {

  constructor(@Inject('PG_CONNECTION') private db: any,
  private prisma: PrismaService) { }

  private tasks: any[] = [];

  async getTasks() : Promise<Task[]> {
    const tasks = await this.prisma.task.findMany();
    return tasks;
  }

  async getTaskById(id: number): Promise<Task> {
    const task = await this.prisma.task.findUnique({
      where: { id },
    });
    return task;
  }

  async insertTask(task: CreateTaskDto): Promise<Task> {
    const newTask = await this.prisma.task.create({
      data: task
    });
    return newTask;
  }

  async updateTask(id: number, taskUpdate: UpdateTaskDto): Promise<Task> {
    const updatedTask = await this.prisma.task.update({
      where: { id },
      data: taskUpdate,
    });
    return updatedTask;
  }

  async deleteTask(id: number): Promise<boolean> {
    const deletedTask = await this.prisma.task.delete({
      where: { id },
    });
    return deletedTask;
  }
}
