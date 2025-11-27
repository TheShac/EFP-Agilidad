import { IsEnum, IsInt, IsOptional, IsPositive, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { EstadoPractica } from './crear-practica.dto';

export class ConsultasJefaturaDto {
  @IsOptional() @IsEnum(EstadoPractica)
  estado?: EstadoPractica;

  @IsOptional() @IsString()
  tipo?: string;

  @IsOptional() @IsString()
  q?: string; // busca por nombre estudiante/empresa/supervisor

  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  centroId?: number;  // Representa empresaId en el backend

  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  colaboradorId?: number;  // Representa supervisorId en el backend

  @IsOptional() @IsString()
  from?: string; // filtra fechaInicio >= from

  @IsOptional() @IsString()
  to?: string;   // filtra fechaInicio <= to

  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  page?: number; 

  @IsOptional() @Type(() => Number) @IsInt() @IsPositive()
  pageSize?: number; 

  @IsOptional() @IsString() @IsIn(['fechaInicio','createdAt','updatedAt','estado','tipo'])
  sortBy?: 'fechaInicio' | 'createdAt' | 'updatedAt' | 'estado' | 'tipo';

  @IsOptional() @IsString() @IsIn(['asc','desc'])
  sortOrder?: 'asc' | 'desc';
}
