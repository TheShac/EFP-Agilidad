import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePracticaDto, EstadoPractica } from './dto/crear-practica.dto';
import { Prisma } from '@prisma/client';
import { Subject } from 'rxjs';
import { ConsultasJefaturaDto } from './dto/consultar-jefatura.dto';


@Injectable()
export class PracticasService {
  constructor(private readonly prisma: PrismaService) {}

  private static overlap(aStart: Date, aEnd: Date | null, bStart: Date, bEnd: Date | null): boolean {
    const aEndOrMax = aEnd ?? new Date(8640000000000000); // max date
    const bEndOrMax = bEnd ?? new Date(8640000000000000);
    return aStart <= bEndOrMax && aEndOrMax >= bStart;
  }
    private readonly changes$ = new Subject<any>();

    get stream$() {
        return this.changes$.asObservable();
    }

    private notifyChange(event: 'created'|'updated'|'deleted', payload: any) {
        this.changes$.next({ type: `practice.${event}`, at: new Date().toISOString(), payload });
    }


  async create(dto: CreatePracticaDto) {
    const estado = dto.estado ?? EstadoPractica.PENDIENTE;
    const start = new Date(dto.fecha_inicio);
    const end = dto.fecha_termino ? new Date(dto.fecha_termino) : null;

    if (isNaN(start.getTime()) || (end && isNaN(end.getTime()))) {
      throw new BadRequestException('Debe completar todos los campos requeridos.');
    }
    if (end && end < start) {
      throw new BadRequestException('Debe completar todos los campos requeridos.');
    }

    // Actualizado para nuevo modelo: estudiante por ID, empresa, supervisor
    const [estudiante, empresa, supervisor] = await Promise.all([
      this.prisma.estudiante.findUnique({ where: { rut: dto.estudianteRut } }),
      this.prisma.empresa.findUnique({ where: { id: dto.centroId } }),
      this.prisma.supervisorEmpresa.findUnique({ where: { id: dto.colaboradorId } }),
    ]);
    if (!estudiante || !empresa || !supervisor) {
      throw new BadRequestException('Debe completar todos los campos requeridos.');
    }

    const posiblesActivas = await this.prisma.practica.findMany({
      where: {
        estudianteId: estudiante.id, // Actualizado: ahora usa ID
        estado: { in: [EstadoPractica.PENDIENTE, EstadoPractica.EN_CURSO] as any },
      },
      select: { id: true, fechaInicio: true, fechaTermino: true }, // Nombres actualizados
    });

    // Si ya hay una práctica activa en estado, se bloquea
    if (posiblesActivas.length > 0 && (estado === EstadoPractica.PENDIENTE || estado === EstadoPractica.EN_CURSO)) {
      throw new BadRequestException('No se puede asignar más de una práctica activa simultáneamente para este estudiante.');
    }

    // Se evita solape de periodos con cualquier práctica activa existente 
    for (const p of posiblesActivas) {
      if (PracticasService.overlap(new Date(p.fechaInicio), p.fechaTermino, start, end)) {
        throw new BadRequestException('No se puede asignar más de una práctica activa simultáneamente para este estudiante.');
      }
    }

    // Generar código único
    const count = await this.prisma.practica.count();
    const codigo = `PRAC-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    // Crear práctica con nuevo modelo
    const created = await this.prisma.practica.create({
      data: {
        codigo,
        estudianteId: estudiante.id,
        empresaId: dto.centroId,
        supervisorId: dto.colaboradorId,
        fechaInicio: start,
        fechaTermino: end,
        tipo: dto.tipo as any ?? 'PRACTICA_PROFESIONAL' as any,
        carrera: estudiante.carrera,
        estado: estado as any,
      },
      include: {
        estudiante: true,
        empresa: true,
        supervisor: true,
      },
    });

    this.notifyChange('created', created);

    return {
      message: 'Práctica asignada exitosamente.',
      data: created,
    };
    
  }

  // Listado para "Gestión de prácticas" 
  async list(params: { estado?: EstadoPractica; estudianteRut?: string }) {
    // Buscar estudiante por RUT si se proporciona
    let estudianteId: number | undefined;
    if (params.estudianteRut) {
      const estudiante = await this.prisma.estudiante.findUnique({
        where: { rut: params.estudianteRut }
      });
      estudianteId = estudiante?.id;
    }

    return this.prisma.practica.findMany({
      where: {
        estado: params.estado as any,
        estudianteId,
      },
      orderBy: { fechaInicio: 'desc' },
      include: { estudiante: true, empresa: true, supervisor: true },
    });
  }

  // Vista para Jefatura 
    async listForJefatura(q: ConsultasJefaturaDto) {
    const page = q.page ?? 1;
    const pageSize = q.pageSize ?? 10;
    const skip = (page - 1) * pageSize;
    const take = pageSize;

    const fromDate = q.from ? new Date(q.from) : undefined;
    const toDate   = q.to   ? new Date(q.to)   : undefined;
    if ((q.from && isNaN(fromDate!.getTime())) || (q.to && isNaN(toDate!.getTime()))) {
        throw new BadRequestException('Rango de fechas inválido');
    }

    const searchFilter = q.q
        ? {
            OR: [
            { estudiante:  { nombre: { contains: q.q, mode: 'insensitive' } } },
            { empresa:     { razonSocial: { contains: q.q, mode: 'insensitive' } } }, // Actualizado
            { supervisor:  { nombre: { contains: q.q, mode: 'insensitive' } } },  // Actualizado
            { carrera:     { contains: q.q, mode: 'insensitive' } },  // Nuevo campo
            ],
        }
        : {};

    const where: Prisma.PracticaWhereInput = {
        ...(q.estado ? { estado: q.estado as any } : {}),
        ...(q.centroId ? { empresaId: q.centroId } : {}),  // Actualizado
        ...(q.colaboradorId ? { supervisorId: q.colaboradorId } : {}),  // Actualizado
        ...(fromDate ? { fechaInicio: { gte: fromDate } } : {}),  // Actualizado
        ...(toDate   ? { fechaInicio: { ...(fromDate ? { gte: fromDate } : {}), lte: toDate } } : {}),  // Actualizado
        ...searchFilter,
    };

    const orderBy: Prisma.PracticaOrderByWithRelationInput =
        q.sortBy ? { [q.sortBy]: q.sortOrder ?? 'desc' } : { fechaInicio: 'desc' };

    const [total, items] = await this.prisma.$transaction([
        this.prisma.practica.count({ where }),
        this.prisma.practica.findMany({
        where, orderBy, skip, take,
        include: {
            estudiante: { select: { rut: true, nombre: true } },
            empresa:    { select: { id: true, razonSocial: true, nombreFantasia: true, tipo: true } },  // Actualizado
            supervisor: { select: { id: true, nombre: true, cargo: true } },  // Actualizado
        },
        }),
    ]);

    return {
        meta: { page, pageSize, total, totalPages: Math.ceil(total / pageSize) },
        items,
    };
    }

  async findOne(id: number) {
    const p = await this.prisma.practica.findUnique({
      where: { id },
      include: { estudiante: true, empresa: true, supervisor: true },
    });
    if (!p) throw new NotFoundException('Práctica no encontrada');
    return p;
  }
}
