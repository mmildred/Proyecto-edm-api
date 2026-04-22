import { IsString, MinLength, IsNotEmpty, IsEmail, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AuthDto {
  @ApiProperty({ example: 'juan.perez@correo.com', description: 'Correo electrónico del usuario' })
  @IsEmail({}, { message: 'El username debe ser un correo electrónico válido' })
  @IsNotEmpty()
  username!: string;

  @ApiProperty({ example: 'Password@123', description: 'Mínimo 8 caracteres, 1 mayúscula, 1 número y 1 símbolo' })
  @IsString()
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @IsNotEmpty()
  @Matches(/(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).*$/, {
    message: 'La contraseña debe contener al menos una mayúscula, un número y un símbolo',
  })
  password!: string;
}
