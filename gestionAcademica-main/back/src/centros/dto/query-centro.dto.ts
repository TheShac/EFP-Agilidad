import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { TipoEmpresa, EstadoEmpresa } from '@prisma/client';

export class QueryCentroDto {
  @IsOptional() @IsString()
  search?: string;  // Busca en razonSocial, nombreFantasia, comuna, region, email

  @IsOptional() @IsEnum(TipoEmpresa)
  tipo?: TipoEmpresa;

  @IsOptional() @IsEnum(EstadoEmpresa)
  estado?: EstadoEmpresa;

  @IsOptional() @IsInt() @Min(1)
  page?: number = 1;

  @IsOptional() @IsInt() @Min(1)
  limit?: number = 10;

  @IsOptional() @IsString()
  orderBy?: 'razonSocial' | 'region' | 'comuna' | 'tipo' = 'razonSocial';

  @IsOptional() @IsString()
  orderDir?: 'asc' | 'desc' = 'asc';
}
