import { Module } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';
import { TaskModule } from './modules/task/task.module';
import { UserModule } from './modules/user/user.module';
import { PrismaService } from './services/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot(),
    AuthModule, 
    UserModule, 
    TaskModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET, 
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [
    PrismaService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}