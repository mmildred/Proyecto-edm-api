import { Injectable, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../../services/prisma.service';
import { UtilService } from '../../services/util.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '../user/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly utilSvc: UtilService,
  ) {}

  async getUsers(): Promise<User[]> {
    const users = await this.prisma.user.findMany({
      select: {
        id: true, name: true, lastname: true, username: true,
        password: false, refreshToken: false, created_dt: true, rol_id: true
      },
    });
    return users as unknown as User[];
  }

  async getUserById(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true, name: true, lastname: true, username: true,
        password: false, refreshToken: false, created_dt: true, rol_id: true
      },
    });
    return user as unknown as User | null;
  }

  async insertUser(createUserDto: CreateUserDto): Promise<User> {
    const { username, password, name, lastname } = createUserDto;

    // 1. VERIFICACIÓN DE CORREO DUPLICADO AL CREAR
    const existingUser = await this.prisma.user.findFirst({ 
      where: { username } 
    });
    
    if (existingUser) {
      // Lanzamos un error 409 Conflict que tu filtro limpiará
      throw new ConflictException('Ese correo electrónico ya se encuentra registrado');
    }

    const hashedPassword = await this.utilSvc.hash(password);

    const newUser = await this.prisma.user.create({
      data: { username, password: hashedPassword, name, lastname },
      select: {
        id: true, name: true, lastname: true, username: true,
        password: false, refreshToken: false, created_dt: true,
      },
    });

    return newUser as unknown as User;
  }

  async updateUser(id: number, updateUserDto: UpdateUserDto, currentUser: any): Promise<User> {
    const isUserRole = currentUser.rol_id === 1;

    if (isUserRole && currentUser.sub !== id) {
      throw new ForbiddenException('No tienes permisos para editar a otros usuarios');
    }

    const existingUser = await this.prisma.user.findUnique({ where: { id } });
    if (!existingUser) throw new NotFoundException(`Usuario no encontrado`);

    const dataToUpdate: any = { ...updateUserDto };

    if (isUserRole && dataToUpdate.username) {
      delete dataToUpdate.username;
    }

    // 2. VERIFICACIÓN DE CORREO DUPLICADO AL ACTUALIZAR (SOLO PARA ADMINS)
    if (dataToUpdate.username) {
      const emailTaken = await this.prisma.user.findFirst({
        where: { 
          username: dataToUpdate.username,
          id: { not: id } // Buscamos si alguien MÁS tiene este correo, excluyendo al usuario actual
        }
      });

      if (emailTaken) {
        throw new ConflictException('Este correo electrónico ya está siendo usado por otro usuario');
      }
    }

    if (updateUserDto.password) {
      dataToUpdate.password = await this.utilSvc.hash(updateUserDto.password);
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: dataToUpdate,
      select: {
        id: true, name: true, lastname: true, username: true,
        password: false, refreshToken: false, created_dt: true,
      },
    });

    return updatedUser as unknown as User;
  }

  async deleteUser(id: number, currentUser: any): Promise<boolean> {
    if (currentUser.rol_id !== 2) {
      throw new ForbiddenException('No tienes permisos para realizar esta acción');
    }

    try {
      await this.prisma.user.delete({ where: { id } });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findTasksByUser(userId: number) {
    return this.prisma.task.findMany({ where: { user_id: userId } });
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.prisma.user.findFirst({ where: { username } });
    return user as unknown as User | null;
  }
}
