import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateColaboradorDto } from './dto/create-colaborador.dto';
import { UpdateColaboradorDto } from './dto/update-colaborador.dto';
import { QueryColaboradorDto } from './dto/query-colaborador.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ColaboradoresService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateColaboradorDto) {
    // Mapear DTO a los campos requeridos de SupervisorEmpresa
    const data = {
      rut: dto.rut,
      nombre: dto.nombre,
      email: dto.email,
      telefono: dto.telefono,
      rol: dto.rol,
      cargo: dto.cargo,
      area: dto.area,
      profesion: dto.profesion,
      aniosExperiencia: dto.aniosExperiencia,
      empresaId: dto.empresaId,
    };
    return this.prisma.supervisorEmpresa.create({ data });
  }

  async findAll(q: QueryColaboradorDto) {
    const { rol, empresaId, search, page = 1, limit = 10, orderBy = 'nombre', orderDir = 'asc' } = q;
    const where = {
      ...(rol ? { rol } : {}),
      ...(empresaId ? { empresaId } : {}),
      ...(search
        ? {
            OR: [
              { nombre: { contains: search, mode: 'insensitive' } },
              { rut: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.supervisorEmpresa.findMany({
        where,
        orderBy: { [orderBy]: orderDir },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          rut: true,
          nombre: true,
          email: true,
          telefono: true,
          rol: true,
          cargo: true,
          area: true,
          profesion: true,
          empresaId: true,
        },
      }),
      this.prisma.supervisorEmpresa.count({ where }),
    ]);

    return {
      items,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    };
  }

  async verPracticas(id: number) {
    const col = await this.prisma.supervisorEmpresa.findUnique({
      where: { id },
      include: {
        practicasAsignadas: {
          select: {
            id: true,
            estado: true,
            fechaInicio: true,
            fechaTermino: true,
            estudiante: { select: { rut: true, nombre: true } },
            empresa: { select: { id: true, razonSocial: true, nombreFantasia: true, comuna: true } },
          },
        },
      },
    });
    if (!col) throw new NotFoundException('Supervisor no encontrado');
    return col;
  }

  async update(id: number, dto: UpdateColaboradorDto) {
    try {
      return await this.prisma.supervisorEmpresa.update({ where: { id }, data: dto });
    } catch {
      throw new NotFoundException('Colaborador no encontrado');
    }
  }

  // Si prefieres borrado lógico, cambia por update({data:{activo:false}})
  async remove(id: number) {
    try {
      return await this.prisma.supervisorEmpresa.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Colaborador no encontrado');
    }
  }
}
