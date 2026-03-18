import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {  }

  public async getUserByUsername(username: string): Promise<any> {
    return await this.prisma.user.findfirst({ where: { username } });
    }
}
