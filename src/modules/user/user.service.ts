import { Injectable } from '@nestjs/common';
import { PrismaService } from 'common/services/prisma.service.ts'; 
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { Task } from '../task/entities/task.entity';

@Injectable()
export class UserService {
    constructor(private prisma: PrismaService) {}

    public async getUsers(): Promise<User[]> {
        const users = await this.prisma.user.findMany({
            orderBy: {
                id: 'asc'
            }
        });
        return users;
    }

    public async getUsersById(id: number): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: {
                id: id
            },
            include: {
                tasks: true
            }
        });
        return user;  
    }

    public async getUserByUsername(username: string): Promise<User | null> {
        const user = await this.prisma.user.findUnique({
            where: { username: username },
            select: {
                id: true,
                name: true,
                lastname: true,
                username: true,
                password: true,
                createdAt: true,
            }
        });
        return user;
    }

    public async insert(user: CreateUserDto): Promise<User> {
        const result = await this.prisma.user.create({
            data: user
        });
        return result;
    }

    public async update(id: number, user: UpdateUserDto): Promise<User> {
        const result = await this.prisma.user.update({
            where: {
                id: id
            },
            data: user
        });
        return result;
    }

    public async delete(id: number): Promise<boolean> {
        try {
            await this.prisma.user.delete({
                where: {
                    id: id
                }
            });
            return true;
        } catch (error) {
            return false;
        }   
    }
}