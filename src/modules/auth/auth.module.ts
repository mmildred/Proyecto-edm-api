import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../../services/prisma.service';
import { UtilService } from '../../services/util.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UtilService],
  exports: [AuthService],
})
export class AuthModule {}