import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { PrismaService } from '../../services/prisma.service';
import { UtilService } from '../../services/util.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [TaskController],
  providers: [
    TaskService, 
    PrismaService, 
    UtilService,
    AuthGuard,
    JwtService,
  ],
})
export class TaskModule {}