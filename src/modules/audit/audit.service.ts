import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';

export interface CreateAuditLogDto {
  userId?: number;
  action: string;
  severity: 'INFO' | 'WARNING' | 'CRITICAL';
  ip?: string;
  details?: any;
}

export interface AuditLogFilters {
  userId?: number;
  action?: string;
  severity?: string;
  startDate?: Date;
  endDate?: Date;
}

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async createLog(data: CreateAuditLogDto) {
    return (this.prisma as any).auditLog.create({
      data: {
        userId: data.userId,
        action: data.action,
        severity: data.severity,
        ip: data.ip,
        details: data.details,
      },
    });
  }

  async findAll(filters: AuditLogFilters) {
    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.action) where.action = filters.action;
    if (filters.severity) where.severity = filters.severity;
    
    if (filters.startDate || filters.endDate) {
      where.timestamp = {};
      if (filters.startDate) where.timestamp.gte = filters.startDate;
      if (filters.endDate) where.timestamp.lte = filters.endDate;
    }

    return (this.prisma as any).auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
      orderBy: { timestamp: 'desc' },
    });
  }

  async logLoginFailed(username: string, ip: string) {
    return this.createLog({
      action: 'LOGIN_FAILED',
      severity: 'WARNING',
      ip,
      details: { username },
    });
  }

  async logLoginSuccess(userId: number, ip: string) {
    return this.createLog({
      userId,
      action: 'LOGIN_SUCCESS',
      severity: 'INFO',
      ip,
    });
  }

  async logTaskCreated(userId: number, taskId: number, taskName: string, ip: string) {
    return this.createLog({
      userId,
      action: 'TASK_CREATED',
      severity: 'INFO',
      ip,
      details: { taskId, taskName },
    });
  }

  async logTaskDeleted(userId: number, taskId: number, taskName: string, ip: string) {
    return this.createLog({
      userId,
      action: 'TASK_DELETED',
      severity: 'WARNING',
      ip,
      details: { taskId, taskName },
    });
  }

  async logRoleChanged(adminId: number, targetUserId: number, oldRole: string, newRole: string, ip: string) {
    return this.createLog({
      userId: adminId,
      action: 'ROLE_CHANGED',
      severity: 'CRITICAL',
      ip,
      details: { targetUserId, oldRole, newRole },
    });
  }
}