import { Body, Controller, Delete, Get, HttpCode, HttpException, HttpStatus, Param, ParseIntPipe, Post, Put, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { Task } from './entities/task.entity';
import { UpdateTaskDto } from './dto/update-task.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../common/guards/auth.guard';
import { AuditService } from '../audit/audit.service';

@Controller('api/task')
@ApiTags("Tareas")
@UseGuards(AuthGuard)
@ApiBearerAuth('access-token')
export class TaskController {
  constructor(
    private readonly taskSvc: TaskService,
    private readonly auditService: AuditService
  ) { }

  @Get()
  public async getTasks(@Req() request: any): Promise<Task[]> {
    return await this.taskSvc.getTasks(request.user);
  }

  @Get(':id')
  @HttpCode(200)
  public async getTaskById(@Req() request: any, @Param("id", ParseIntPipe) id: number): Promise<Task> {
    const task = await this.taskSvc.getTaskById(id, request.user);

    if (!task) {
      throw new HttpException(`Tarea con ID ${id} no encontrada`, HttpStatus.NOT_FOUND);
    }
    return task;
  }

  @Post()
  @ApiOperation({ summary: 'Insert a task in the db' })
  public async insertTask(@Req() request: any, @Body() task: CreateTaskDto): Promise<Task> {
    const result = await this.taskSvc.insertTask(task, request.user);

    if (!result) {
      throw new HttpException("Tarea no registrada", HttpStatus.INTERNAL_SERVER_ERROR);
    }

    const userId = request.user?.sub || 0;
    const taskId = result.id || 0;
    const taskName = result.name || '';
    const ip = request.ip || request.connection?.remoteAddress || 'unknown';

    await this.auditService.logTaskCreated(userId, taskId, taskName, ip);

    return result;
  }

  @Put(":id")
  public async updateTask(@Req() request: any, @Param("id", ParseIntPipe) id: number, @Body() task: UpdateTaskDto): Promise<Task> {
    return await this.taskSvc.updateTask(id, task, request.user);
  }

  @Delete(':id')
  public async deleteTask(@Req() request: any, @Param("id", ParseIntPipe) id: number): Promise<boolean> {
    const existingTask = await this.taskSvc.getTaskById(id, request.user);

    if (!existingTask) {
      throw new HttpException("Task not found", HttpStatus.NOT_FOUND);
    }

    await this.taskSvc.deleteTask(id, request.user);

    const userId = request.user?.sub || 0;
    const taskId = id;
    const taskName = existingTask.name || '';
    const ip = request.ip || request.connection?.remoteAddress || 'unknown';

    await this.auditService.logTaskDeleted(userId, taskId, taskName, ip);

    return true;
  }
}