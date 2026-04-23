import { Module } from '@nestjs/common';
import { AuditService } from './audit.service';
import { AuditController } from './audit.controller';
import { PrismaService } from '../../services/prisma.service';
import { UtilService } from '../../services/util.service';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [AuditController],
  providers: [
    AuditService, 
    PrismaService,
    UtilService,
    JwtService, 
  ],
  exports: [AuditService],
})
export class AuditModule {}