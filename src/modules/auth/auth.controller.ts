import { Body, Controller, Get, HttpCode, HttpStatus, Post, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation } from '@nestjs/swagger';
import { AuthDto } from '../dto/auth.dto';

@Controller('api/auth')
export class AuthController {
  utilService: any;
  constructor(private authService: AuthService,) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  public async login(@Body() authDto: AuthDto): Promise<{ jwt: string; refreshToken: string }> {
    const { username, password } = authDto;

    // Verificar usuario y contraseña
    const user = await this.authService.getUserByUsername(username);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // ERROR 1: this.utilService no está declarado en el constructor
    // Debes inyectarlo o mover esta lógica a authService
    if (await this.utilService.checkPassword(password, user.password!)) {
      // ERROR 2: No puedes desestructurar password así directamente
      // Crea un nuevo objeto sin el password
      const { password: _, ...payload } = user;
      
      // ERROR 3: refreshJwt no está definido
      // Debes generar el refresh token primero
      const jwt = await this.utilService.generateJWT(payload, '7d');
      const refreshJwt = await this.utilService.generateRefreshToken(payload); // o similar

      return { jwt, refreshToken: refreshJwt };
    } else {
      throw new UnauthorizedException('The user or password does not exist');
    }
  }

  @Get("me")
  @ApiOperation({ summary: 'Get current user' })
  public getProfile() {
    // Implementar lógica para obtener perfil del usuario actual
    // Normalmente usando el token JWT
  }
  
  @Post('refresh')
  @ApiOperation({ summary: 'Refresh access token' })
  public refreshToken() {
    // Implementar lógica de refresh token
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  public logout() {
    // Implementar lógica de logout
  }
}