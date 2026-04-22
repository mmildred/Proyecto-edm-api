import { Controller, Post, Body, HttpCode, HttpStatus, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() authDto: AuthDto) {
    return this.authService.login(authDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Body('userId') userId: string) {
    const id = parseInt(userId, 10);
    if (isNaN(id)) {
      throw new UnauthorizedException('ID de usuario inválido');
    }
    await this.authService.logout(id);
    return { message: 'Sesión cerrada exitosamente' };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body('refreshToken') refreshToken: string) {
    // Implementación segura del refresh token flow
    // (Se implementa en un servicio aparte normalmente)
    return { message: 'Refresh token endpoint' };
  }
}