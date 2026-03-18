import { Controller, Get, HttpException, UseGuards } from "@nestjs/common";
import { UtilService } from "../../common/services/util.service";
import { ApiTags } from "@nestjs/swagger";
import { CreateTaskDto } from "../task/dto/create-task.dto";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { AuthGuard } from "../../common/guards/auth.guard";

@Controller('api/users')
@ApiTags('users')
@UseGuards(AuthGuard)
export class UserController {
    constructor(
        private userService: UserService,
        private readonly: UserService,
        private utilService: UtilService
    ) {}

    @Get()
    public async getUsers(): Promise<User[]> {
        return await this.userService.getUsers();
    }

    @Get(':id')
    public async getUsersById(id: number): Promise<User> {
        return await this.userService.getUsersById(id);
    }

    

    public async insert(@Body() user: CreateUserDto): Promise<User> {
        if (currentUser.lenght>0)
            throw new HttpException('Username already exists', HttpStatus.BAD_REQUEST);

        const hashPassword = await this.utilService.hashPassword(user.password);
        user.password = hashPassword;
        return await this.userService.insert(user);
    }
}