import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCentroDto } from './dto/create-centro.dto';
import { UpdateCentroDto } from './dto/update-centro.dto';
import { QueryCentroDto } from './dto/query-centro.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class CentrosService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateCentroDto) {
    // Mapear DTO a los campos requeridos de Empresa
    const data = {
      rut: dto.rut,
      razonSocial: dto.razonSocial,
      nombreFantasia: dto.nombreFantasia,
      tipo: dto.tipo,
      tamano: dto.tamano,
      region: dto.region,
      comuna: dto.comuna,
      direccion: dto.direccion,
      telefono: dto.telefono,
      email: dto.email,
      sitioWeb: dto.sitioWeb,
      estado: dto.estado ?? 'ACTIVA',
      observaciones: dto.observaciones,
    };
    return this.prisma.empresa.create({ data });
  }

  async findAll(q: QueryCentroDto) {
    // -------- Normalización segura de query params --------
    const pageRaw  = q.page ?? 1;
    const limitRaw = q.limit ?? 10;

    const pageNum  = Number(pageRaw);
    const limitNum = Number(limitRaw);

    const page  = Number.isFinite(pageNum)  && pageNum  > 0 ? pageNum  : 1;
    const limit = Number.isFinite(limitNum) && limitNum > 0 ? limitNum : 10;

    // Puedes poner un máximo razonable
    const MAX_LIMIT = 1000;
    const safeLimit = Math.min(limit, MAX_LIMIT);

    // orderBy y orderDir con whitelists
    const allowedOrderBy = new Set<keyof any>([
      'id', 'razonSocial', 'nombreFantasia', 'region', 'comuna', 'tipo', 'correo', 'estado'
    ]);
    const orderBy = (q.orderBy && allowedOrderBy.has(q.orderBy as any))
      ? (q.orderBy as string)
      : 'razonSocial';

    const orderDir = q.orderDir === 'desc' ? 'desc' : 'asc';

    // -------- Filtro WHERE --------
    const where = {
      ...(q.tipo ? { tipo: q.tipo } : {}),
      ...(q.search
        ? {
            OR: [
              { razonSocial: { contains: q.search, mode: 'insensitive' } },
              { nombreFantasia: { contains: q.search, mode: 'insensitive' } },
              { comuna: { contains: q.search, mode: 'insensitive' } },
              { region: { contains: q.search, mode: 'insensitive' } },
              { email: { contains: q.search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    // -------- Consulta + conteo en transacción --------
    const [items, total] = await this.prisma.$transaction([
      this.prisma.empresa.findMany({
        where,
        orderBy: { [orderBy]: orderDir },
        skip: (page - 1) * safeLimit,
        take: safeLimit,
        select: {
          id: true,
          rut: true,
          razonSocial: true,
          nombreFantasia: true,
          region: true,
          comuna: true,
          direccion: true,
          telefono: true,
          email: true,
          tipo: true,
          tamano: true,
          estado: true,
          sitioWeb: true,
          _count: {
            select: {
              practicas: true,
              supervisores: true,
            },
          },
        },
      }),
      this.prisma.empresa.count({ where }),
    ]);

    return {
      items,
      page,
      limit: safeLimit,
      total,
      pages: Math.max(0, Math.ceil(total / safeLimit)),
    };
  }

  async findOne(id: number) {
    const centro = await this.prisma.empresa.findUnique({
      where: { id },
      include: {
        practicas: {
          select: {
            id: true,
            estado: true,
            fechaInicio: true,
            fechaTermino: true,
            estudiante: { select: { rut: true, nombre: true } },
            supervisor: { select: { id: true, nombre: true, rol: true, cargo: true } },
          },
          orderBy: { fechaInicio: 'desc' },
        },
        supervisores: {
          select: { id: true, rut: true, nombre: true, rol: true, cargo: true, email: true, telefono: true },
          orderBy: { nombre: 'asc' },
        },
      },
    });

    if (!centro) throw new NotFoundException('Empresa no encontrada');
    return centro;
  }

  async update(id: number, dto: UpdateCentroDto) {
    try {
      // Mapear DTO a los campos de Empresa
      const data: any = {};
      if (dto.rut !== undefined) data.rut = dto.rut;
      if (dto.razonSocial !== undefined) data.razonSocial = dto.razonSocial;
      if (dto.nombreFantasia !== undefined) data.nombreFantasia = dto.nombreFantasia;
      if (dto.tipo !== undefined) data.tipo = dto.tipo;
      if (dto.tamano !== undefined) data.tamano = dto.tamano;
      if (dto.region !== undefined) data.region = dto.region;
      if (dto.comuna !== undefined) data.comuna = dto.comuna;
      if (dto.direccion !== undefined) data.direccion = dto.direccion;
      if (dto.telefono !== undefined) data.telefono = dto.telefono;
      if (dto.email !== undefined) data.email = dto.email;
      if (dto.sitioWeb !== undefined) data.sitioWeb = dto.sitioWeb;
      if (dto.estado !== undefined) data.estado = dto.estado;
      if (dto.observaciones !== undefined) data.observaciones = dto.observaciones;
      
      return await this.prisma.empresa.update({ where: { id }, data });
    } catch {
      throw new NotFoundException('Empresa no encontrada');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.empresa.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Empresa no encontrada');
    }
  }
}
