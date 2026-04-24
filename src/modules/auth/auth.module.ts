import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../../services/prisma.service';
import { UtilService } from '../../services/util.service';
import { JwtService } from '@nestjs/jwt';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [forwardRef(() => AuditModule)],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, UtilService, JwtService],
  exports: [AuthService],
})
export class AuthModule {}