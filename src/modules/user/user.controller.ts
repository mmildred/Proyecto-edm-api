import {
  Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put,
  HttpException, NotFoundException, InternalServerErrorException, HttpStatus,
  UseGuards, Req
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { User } from '../user/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '../../common/guards/auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/role.enum';

@Controller('api/user')
@ApiTags('Users')
export class UserController {
  constructor(private userSvc: UserService) { }

  @Get()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  public async getUser(): Promise<User[]> {
    try {
      return await this.userSvc.getUsers();
    } catch (error) {
      throw new InternalServerErrorException('Error al obtener la lista de usuarios');
    }
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(AuthGuard)
  public async getUserById(@Param('id', ParseIntPipe) id: number): Promise<User> {
    try {
      const user = await this.userSvc.getUserById(id);

      if (!user) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      return user;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Ocurrió un error al buscar el usuario ${id}`);
    }
  }

  @Post()
  @ApiOperation({ summary: 'Registrar un usuario nuevo (rol "user" por defecto)' })
  public async insertUser(@Body() user: CreateUserDto): Promise<User> {
    try {
      const result = await this.userSvc.insertUser(user);
      if (!result) {
        throw new InternalServerErrorException('El usuario no pudo ser registrado');
      }
      return result;
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException('Error interno al registrar el usuario');
    }
  }

  @Put(':id')
  @UseGuards(AuthGuard)
  public async updateUser(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number,
    @Body() user: UpdateUserDto,
  ): Promise<User> {
    try {
      const currentUser = request.user;
      const isAdmin = currentUser.role === 'admin' || currentUser.rol_id === 2;

      if (!isAdmin && currentUser.sub !== id) {
        throw new HttpException('No tienes permiso para editar este perfil', HttpStatus.FORBIDDEN);
      }

      const existing = await this.userSvc.getUserById(id);
      if (!existing) {
        throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
      }

      return await this.userSvc.updateUser(id, user, request.user);
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new InternalServerErrorException(`Error al actualizar el usuario con ID ${id}`);
    }
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  public async deleteUser(
    @Req() request: any,
    @Param('id', ParseIntPipe) id: number
  ): Promise<boolean> {
    const result = await this.userSvc.deleteUser(id, request.user);

    if (!result) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }
    return true;
  }
}
