import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength, MaxLength, Matches, IsEmail } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ example: 'Ana', description: 'Nombre del usuario' })
    @IsString()
    @IsNotEmpty({ message: 'El nombre es obligatorio' })
    @MinLength(2, { message: 'El nombre debe tener al menos 2 caracteres' })
    @MaxLength(50, { message: 'El nombre no puede exceder los 50 caracteres' })
    name!: string;

    @ApiProperty({ example: 'García', description: 'Apellido del usuario' })
    @IsString()
    @IsNotEmpty({ message: 'El apellido es obligatorio' })
    @MinLength(2, { message: 'El apellido debe tener al menos 2 caracteres' })
    @MaxLength(50, { message: 'El apellido no puede exceder los 50 caracteres' })
    lastname!: string;

    @ApiProperty({ example: 'ana.garcia@correo.com', description: 'Correo electrónico único' })
    @IsEmail({}, { message: 'El username debe ser un correo electrónico válido' })
    @IsNotEmpty({ message: 'El correo electrónico es obligatorio' })
    @MaxLength(150, { message: 'El correo no puede exceder los 150 caracteres' })
    username!: string;

    @ApiProperty({ example: 'Password@123', description: 'Mínimo 8 caracteres, una mayúscula, un número y un símbolo' })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @MaxLength(50, { message: 'La contraseña es demasiado larga' })
    @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/, {
        message: 'La contraseña debe contener al menos una letra mayúscula, un número y un símbolo especial',
    })
    password!: string;
}
