import { RolSupervisor } from '@prisma/client';
import { IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateColaboradorDto {
  @IsString()
  @Length(3, 20)
  rut: string;

  @IsString()
  @Length(3, 120)
  nombre: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsOptional() @IsString()
  telefono?: string;

  @IsOptional() @IsString()
  cargo?: string;

  @IsEnum(RolSupervisor)
  rol: RolSupervisor;

  @IsOptional() @IsString()
  area?: string;  // Área o departamento

  @IsInt()
  @IsNotEmpty()
  empresaId: number;  // Relación con empresa

  @IsOptional() @IsString()
  profesion?: string;

  @IsOptional() @IsInt() @Min(0)
  aniosExperiencia?: number;
}
