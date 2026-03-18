import { Module } from '@nestjs/common';
import { TaskController } from './task.controller';
import { TaskService } from './task.service';
import { pgProvider } from '../../common/providers/pg.provider';
import { mysqlProvider } from '../../common/providers/mysql.provider';
import { PrismaService } from '../../common/services/prisma.service';

@Module({
  controllers: [TaskController],
  providers: [TaskService, pgProvider[0], mysqlProvider[0], PrismaService],
})
export class TaskModule {}
