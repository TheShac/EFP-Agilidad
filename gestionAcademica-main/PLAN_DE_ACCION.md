# 🚀 Plan de Acción: Próximos Pasos

## Estado Actual ✅

- ✅ Modelo de datos completamente rediseñado
- ✅ Base de datos MySQL sincronizada
- ✅ Schema de Prisma validado
- ✅ Cliente de Prisma generado
- ✅ Documentación completa creada
- ✅ 15 tablas creadas correctamente

---

## 📋 Tareas Pendientes (Prioridad)

### 🔴 PRIORIDAD CRÍTICA - Backend

#### 1. Reestructurar Módulos (2-3 días)

**A. Renombrar módulos existentes:**

```bash
# En src/
src/centros/          → src/empresas/
src/colaboradores/    → src/supervisores/
src/estudiante/       → src/estudiantes/
```

**B. Consolidar módulos:**
```bash
# Unificar estos dos en src/solicitudes/
src/authorization-requests/  ┐
src/carta/                   ┘→ src/solicitudes/
```

**C. Eliminar módulos obsoletos:**
```bash
src/trabajador/  → ELIMINAR (funcionalidad en supervisores)
```

**D. Crear nuevos módulos:**
```bash
src/auth/          # Autenticación JWT
src/usuarios/      # Gestión de usuarios
src/actividades/   # Actividades de práctica
src/asistencias/   # Control de asistencia
src/encuestas/     # Sistema de encuestas
src/reportes/      # Generación de reportes
```

---

#### 2. Actualizar DTOs (1-2 días)

**Empresas** (antes Centros):
```typescript
// src/empresas/dto/create-empresa.dto.ts
export class CreateEmpresaDto {
  rut: string;                    // Nuevo - obligatorio
  razonSocial: string;            // Antes: nombre
  nombreFantasia?: string;        // Nuevo
  tipo: TipoEmpresa;              // Enum actualizado
  tamano?: TamanoEmpresa;         // Nuevo
  sector?: string;                // Nuevo
  region?: string;
  comuna?: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  tieneConvenio?: boolean;        // Nuevo
  fechaConvenio?: Date;           // Nuevo
  cuposPracticas?: number;        // Nuevo
}
```

**Supervisores** (antes Colaboradores):
```typescript
// src/supervisores/dto/create-supervisor.dto.ts
export class CreateSupervisorDto {
  rut: string;
  nombre: string;
  email: string;
  telefono?: string;
  cargo?: string;
  rol: RolSupervisor;             // Enum nuevo
  empresaId: number;              // Obligatorio
  area?: string;                  // Nuevo
  profesion?: string;             // Nuevo
  aniosExperiencia?: number;      // Nuevo
}
```

**Estudiantes**:
```typescript
// src/estudiantes/dto/create-estudiante.dto.ts
export class CreateEstudianteDto {
  rut: string;
  nombre: string;
  email: string;
  telefono?: string;
  carrera: string;                // Antes: plan
  mencion?: string;               // Nuevo
  semestreActual?: number;        // Nuevo
  promedioGeneral?: number;       // Simplificado
  fechaNacimiento?: Date;         // Antes: anio_nacimiento
  direccion?: string;
  comuna?: string;
  region?: string;
  
  // REMOVIDOS:
  // puntaje_psu, puntaje_ponderado, sistema_ingreso, numero_inscripciones
}
```

**Prácticas**:
```typescript
// src/practicas/dto/create-practica.dto.ts
export class CreatePracticaDto {
  estudianteId: number;           // Antes: estudianteRut
  empresaId: number;              // Antes: centroId
  supervisorId: number;           // Antes: colaboradorId
  tipo: TipoPractica;             // Enum tipado
  carrera: string;                // Nuevo
  semestre?: number;              // Nuevo
  fechaInicio: Date;
  fechaTermino?: Date;
  horasTotales?: number;          // Nuevo
  areaAsignada?: string;          // Nuevo
}
```

**Solicitudes**:
```typescript
// src/solicitudes/dto/create-solicitud.dto.ts
export class CreateSolicitudDto {
  codigo: string;                 // PHG-2025-001
  empresaId: number;
  nombreDestinatario: string;
  cargoDestinatario: string;
  ciudad: string;
  fechaCarta: Date;
  asunto: string;
  tipoPractica: TipoPractica;
  carrera: string;
  fechaInicio: Date;
  fechaTermino: Date;
  estudiantes: Array<{           // Estructurado
    rut: string;
    nombre: string;
  }>;
  nombreTutor?: string;
  telefonoTutor?: string;
}
```

---

#### 3. Actualizar Servicios (2-3 días)

**Ejemplo: EmpresasService**
```typescript
// src/empresas/empresas.service.ts
@Injectable()
export class EmpresasService {
  constructor(private prisma: PrismaService) {}

  async create(createEmpresaDto: CreateEmpresaDto) {
    // Validar RUT único
    const exists = await this.prisma.empresa.findUnique({
      where: { rut: createEmpresaDto.rut }
    });
    if (exists) {
      throw new ConflictException('RUT ya registrado');
    }

    return this.prisma.empresa.create({
      data: {
        ...createEmpresaDto,
        estado: EstadoEmpresa.ACTIVA,
        fechaRegistro: new Date(),
      }
    });
  }

  async findAll(filtros?: {
    tipo?: TipoEmpresa;
    estado?: EstadoEmpresa;
    tieneConvenio?: boolean;
  }) {
    return this.prisma.empresa.findMany({
      where: filtros,
      include: {
        supervisores: true,
        practicas: {
          include: {
            estudiante: true,
          }
        }
      },
      orderBy: { razonSocial: 'asc' }
    });
  }

  async findOne(id: number) {
    const empresa = await this.prisma.empresa.findUnique({
      where: { id },
      include: {
        supervisores: true,
        practicas: {
          include: {
            estudiante: true,
            supervisor: true,
          }
        },
        solicitudes: true,
      }
    });

    if (!empresa) {
      throw new NotFoundException(`Empresa con ID ${id} no encontrada`);
    }

    return empresa;
  }

  async verificarConvenioVigente(empresaId: number): Promise<boolean> {
    const empresa = await this.findOne(empresaId);
    
    if (!empresa.tieneConvenio) return false;
    if (!empresa.fechaVencimiento) return true;
    
    return new Date() < empresa.fechaVencimiento;
  }

  async obtenerCuposDisponibles(empresaId: number): Promise<number> {
    const empresa = await this.findOne(empresaId);
    const practicasActivas = await this.prisma.practica.count({
      where: {
        empresaId,
        estado: EstadoPractica.EN_CURSO,
      }
    });
    
    return (empresa.cuposPracticas || 0) - practicasActivas;
  }
}
```

---

#### 4. Crear Módulo de Autenticación (1 día)

```typescript
// src/auth/auth.module.ts
@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' },
    }),
    UsuariosModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
```

```typescript
// src/auth/auth.service.ts
@Injectable()
export class AuthService {
  async login(email: string, password: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email },
      include: {
        estudiante: true,
        supervisorEmpresa: true,
      }
    });

    if (!usuario || !usuario.activo) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const valid = await bcrypt.compare(password, usuario.password);
    if (!valid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    // Actualizar último acceso
    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoAcceso: new Date() }
    });

    const payload = {
      sub: usuario.id,
      email: usuario.email,
      rol: usuario.rol,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      }
    };
  }
}
```

---

#### 5. Actualizar app.module.ts (30 minutos)

```typescript
import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';

// Módulos actualizados
import { AuthModule } from './auth/auth.module';
import { UsuariosModule } from './usuarios/usuarios.module';
import { EmpresasModule } from './empresas/empresas.module';
import { SupervisoresModule } from './supervisores/supervisores.module';
import { EstudiantesModule } from './estudiantes/estudiantes.module';
import { PracticasModule } from './practicas/practicas.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { ActividadesModule } from './actividades/actividades.module';
import { AsistenciasModule } from './asistencias/asistencias.module';
import { EncuestasModule } from './encuestas/encuestas.module';
import { ReportesModule } from './reportes/reportes.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UsuariosModule,
    EmpresasModule,
    SupervisoresModule,
    EstudiantesModule,
    PracticasModule,
    SolicitudesModule,
    ActividadesModule,
    AsistenciasModule,
    EncuestasModule,
    ReportesModule,
  ],
})
export class AppModule {}
```

---

### 🟡 PRIORIDAD MEDIA - Frontend

#### 1. Actualizar Servicios Angular (1-2 días)

```typescript
// src/app/services/empresas.service.ts
@Injectable({
  providedIn: 'root'
})
export class EmpresasService {
  private apiUrl = environment.apiUrl + '/empresas';

  getEmpresas(filtros?: {
    tipo?: string;
    estado?: string;
  }): Observable<Empresa[]> {
    return this.http.get<Empresa[]>(this.apiUrl, { params: filtros });
  }

  getEmpresa(id: number): Observable<Empresa> {
    return this.http.get<Empresa>(`${this.apiUrl}/${id}`);
  }

  createEmpresa(empresa: CreateEmpresaDto): Observable<Empresa> {
    return this.http.post<Empresa>(this.apiUrl, empresa);
  }
}
```

#### 2. Actualizar Componentes (2-3 días)

- Renombrar componentes de "centros" a "empresas"
- Actualizar formularios con nuevos campos
- Adaptar tablas y listas
- Actualizar validaciones

---

### 🟢 PRIORIDAD BAJA - Datos y Testing

#### 1. Crear Seed de Datos (1 día)

```typescript
// prisma/seed.ts
async function main() {
  // Crear usuarios admin
  await prisma.usuario.create({
    data: {
      rut: '11111111-1',
      nombre: 'Administrador',
      email: 'admin@efp.cl',
      password: await bcrypt.hash('admin123', 10),
      rol: 'ADMIN',
      activo: true,
    }
  });

  // Crear empresas de ejemplo
  const empresa1 = await prisma.empresa.create({
    data: {
      rut: '76123456-7',
      razonSocial: 'Tecnologías del Norte S.A.',
      nombreFantasia: 'TecNorte',
      tipo: 'PRIVADA',
      tamano: 'MEDIANA',
      sector: 'Tecnología',
      region: 'Arica y Parinacota',
      comuna: 'Arica',
      email: 'contacto@tecnorte.cl',
      telefono: '582123456',
      tieneConvenio: true,
      cuposPracticas: 10,
      estado: 'CONVENIO_VIGENTE',
    }
  });

  // Crear supervisores
  await prisma.supervisorEmpresa.create({
    data: {
      rut: '12345678-9',
      nombre: 'María González',
      email: 'mgonzalez@tecnorte.cl',
      rol: 'SUPERVISOR_DIRECTO',
      cargo: 'Jefa de RRHH',
      empresaId: empresa1.id,
    }
  });

  // ... más datos
}
```

---

## 📅 Cronograma Sugerido

| Semana | Actividad | Responsable | Estado |
|--------|-----------|-------------|--------|
| **Semana 1** | Reestructurar módulos backend | Dev Backend | ⏳ Pendiente |
| **Semana 1** | Actualizar DTOs | Dev Backend | ⏳ Pendiente |
| **Semana 2** | Actualizar servicios principales | Dev Backend | ⏳ Pendiente |
| **Semana 2** | Crear módulo de autenticación | Dev Backend | ⏳ Pendiente |
| **Semana 3** | Actualizar frontend - servicios | Dev Frontend | ⏳ Pendiente |
| **Semana 3** | Actualizar frontend - componentes | Dev Frontend | ⏳ Pendiente |
| **Semana 4** | Testing e integración | QA | ⏳ Pendiente |
| **Semana 4** | Documentación de usuario | Docs | ⏳ Pendiente |

---

## ✅ Checklist de Validación

### Backend
- [ ] Todos los módulos renombrados
- [ ] DTOs actualizados con nuevos campos
- [ ] Servicios implementando nueva lógica
- [ ] Endpoints REST documentados (Swagger)
- [ ] Validaciones implementadas
- [ ] Tests unitarios pasando
- [ ] Tests de integración pasando

### Frontend
- [ ] Servicios Angular actualizados
- [ ] Componentes adaptados al nuevo modelo
- [ ] Formularios validando campos nuevos
- [ ] Rutas actualizadas
- [ ] Navegación coherente
- [ ] Mensajes de error claros

### Base de Datos
- [ ] Datos de seed creados
- [ ] Migraciones aplicadas
- [ ] Índices optimizados
- [ ] Backup realizado

### Documentación
- [ ] README actualizado
- [ ] API documentada (Swagger)
- [ ] Manual de usuario
- [ ] Guía de deployment

---

## 🎯 Objetivo Final

**Sistema Multi-Empresa completamente funcional con:**

✅ Gestión de múltiples empresas de diferentes sectores  
✅ Control completo de convenios y vigencias  
✅ Asignación inteligente de prácticas  
✅ Seguimiento de horas y asistencia  
✅ Sistema de encuestas bidireccional  
✅ Reportes y estadísticas avanzadas  
✅ Autenticación y autorización por roles  
✅ Generación de documentos estandarizados  

---

**Fecha de inicio**: 27 de Noviembre de 2025  
**Duración estimada**: 4 semanas  
**Esfuerzo estimado**: 120-160 horas

¿Listo para comenzar? 🚀
