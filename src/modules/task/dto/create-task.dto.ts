import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateTaskDto {
    @ApiProperty({ example: 'Comprar componentes', description: 'Nombre de la tarea' })
    @IsString({ message: "El nombre debe ser un texto" })
    @IsNotEmpty()
    @MinLength(3, { message: "El nombre debe tener al menos 3 caracteres" })
    @MaxLength(50, { message: "El nombre no debe exceder los 50 caracteres" })
    name: string | undefined;

    @ApiProperty({ example: 'Comprar cable UTP y conectores RJ45', description: 'Detalle de la tarea' })
    @IsString({ message: "La descripción debe ser un texto" })
    @IsNotEmpty()
    @MinLength(3, { message: "La descripción debe tener al menos 3 caracteres" })
    @MaxLength(250, { message: "La descripción no debe exceder los 250 caracteres" })
    description: string | undefined;

    @ApiProperty({ example: true, description: 'Indica si la tarea es de alta prioridad' })
    @IsNotEmpty()
    @IsBoolean({ message: "El estado debe ser un valor booleano" })
    priority: boolean | undefined;
}
