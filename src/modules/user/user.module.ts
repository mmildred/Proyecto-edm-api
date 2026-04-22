import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { PrismaService } from '../../services/prisma.service';
import { UtilService } from '../../services/util.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UtilService],
  exports: [UserService],
})
export class UserModule {}