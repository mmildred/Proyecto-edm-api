import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { UtilService } from '../../services/util.service';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utilSvc: UtilService,
  ) { }

  async login(loginDto: AuthDto): Promise<any> {
    const { username, password } = loginDto;

    const user = await this.prisma.user.findFirst({
      where: { username },
      include: { rol: true }
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await this.utilSvc.checkPassword(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = {
      sub: user.id,
      username: user.username,
      rol_id: user.rol_id,
      role: user.rol?.description || 'user'
    };

    const refreshToken = await this.utilSvc.generateToken(payload, '7d');
    const refreshTokenHash = await this.utilSvc.hash(refreshToken);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: refreshTokenHash },
    });

    const accessToken = await this.utilSvc.generateToken(payload, '1h');

    return {
      accessToken,
      refreshToken,
    };
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        lastname: true,
        username: true,
        created_dt: true,
      },
    });
  }

  async getUserByUsername(username: string) {
    return this.prisma.user.findFirst({
      where: { username },
    });
  }

  async logout(userId: number): Promise<void> {
    await this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: null },
    });
  }

  async updateUserSession(userId: number, refreshToken: string | null) {
    const hash = refreshToken ? await this.utilSvc.hash(refreshToken) : null;
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshToken: hash },
    });
  }
}