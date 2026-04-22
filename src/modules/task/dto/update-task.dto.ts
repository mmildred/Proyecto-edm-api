import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsOptional, IsString, MaxLength, MinLength } from "class-validator";

export class UpdateTaskDto {
    @ApiProperty({ example: 'Comprar componentes de red', required: false })
    @IsString({ message: "El nombre debe ser un texto" })
    @IsOptional()
    @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
    @MaxLength(50, { message: "El nombre no debe exceder los 50 caracteres" })
    name?: string;

    @ApiProperty({ example: 'Comprar cable UTP, conectores RJ45 y un switch', required: false })
    @IsString({ message: "La descripción debe ser un texto" })
    @IsOptional()
    @MinLength(3, { message: "La descripción debe tener al menos 3 caracteres" })
    @MaxLength(250, { message: "La descripción no debe exceder los 250 caracteres" })
    description?: string;

    @ApiProperty({ example: false, required: false })
    @IsOptional()
    @IsBoolean({ message: "El estado debe ser un valor booleano" })
    priority?: boolean;
}
