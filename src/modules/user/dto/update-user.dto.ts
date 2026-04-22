import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsEmail, Matches, MinLength } from "class-validator";

export class UpdateUserDto {
    @ApiProperty({ example: 'Ana María', required: false })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiProperty({ example: 'García López', required: false })
    @IsString()
    @IsOptional()
    lastname?: string;

    @ApiProperty({ example: 'ana.nueva@correo.com', required: false })
    @IsEmail({}, { message: 'El username debe ser un correo electrónico válido' })
    @IsOptional()
    username?: string;

    @ApiProperty({ example: 'NuevaPass@123', required: false })
    @IsString()
    @IsOptional()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
    @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/, {
        message: 'La contraseña debe contener al menos una letra mayúscula, un número y un símbolo especial',
    })
    password?: string;
}
