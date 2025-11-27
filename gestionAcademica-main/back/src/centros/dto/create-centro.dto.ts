import { IsEmail, IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { TipoEmpresa, TamanoEmpresa, EstadoEmpresa } from '@prisma/client';

export class CreateCentroDto {
  @IsString()
  @MaxLength(100)
  @IsNotEmpty()
  rut!: string;

  @IsString()
  @MaxLength(200)
  @IsNotEmpty()
  razonSocial!: string;

  @IsOptional() @IsString() @MaxLength(200)
  nombreFantasia?: string | null;

  @IsEnum(TipoEmpresa)
  tipo!: TipoEmpresa;

  @IsOptional() @IsEnum(TamanoEmpresa)
  tamano?: TamanoEmpresa | null;

  @IsString()
  @IsNotEmpty()
  region!: string;

  @IsString()
  @IsNotEmpty()
  comuna!: string;

  @IsOptional() @IsString() @MaxLength(255)
  direccion?: string | null;

  @IsOptional() @IsString() @MaxLength(50)
  telefono?: string | null;

  @IsOptional() @IsEmail()
  email?: string | null;

  @IsOptional() @IsString()
  sitioWeb?: string | null;

  @IsOptional() @IsEnum(EstadoEmpresa)
  estado?: EstadoEmpresa = EstadoEmpresa.ACTIVA;

  @IsOptional() @IsString()
  observaciones?: string | null;
}
