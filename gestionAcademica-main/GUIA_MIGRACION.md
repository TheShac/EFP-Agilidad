# 🔄 Guía de Migración: Sistema Pedagógico → Sistema Multi-Empresa

## 📋 Resumen de Cambios

Esta guía detalla la transformación del sistema de gestión de prácticas pedagógicas a un sistema multi-empresa generalizado.

---

## 🔀 Mapeo de Entidades

### Cambios en el Modelo de Datos

| **Antes (Pedagógico)** | **Después (Multi-Empresa)** | **Cambios** |
|------------------------|----------------------------|-------------|
| `CentroEducativo` | `Empresa` | ✅ Renombrado y expandido |
| `TrabajadorEduc` | `SupervisorEmpresa` | ✅ Renombrado con nuevos campos |
| `Colaborador` | `SupervisorEmpresa` | ✅ Consolidado en una sola entidad |
| `Estudiante` | `Estudiante` | ⚠️ Campos actualizados |
| `Practica` | `Practica` | ⚠️ Relaciones actualizadas |
| `Actividad` | `ActividadPractica` | ✅ Renombrado |
| `CartaSolicitud` | `SolicitudAutorizacion` | ✅ Rediseñado completamente |
| `AuthorizationRequest` | `SolicitudAutorizacion` | ✅ Consolidado |
| `Usuario` | `Usuario` | ⚠️ Roles actualizados |

---

## 📊 Comparación Detallada

### 1. CentroEducativo → Empresa

#### Antes:
```prisma
model CentroEducativo {
  id              Int       @id @default(autoincrement())
  nombre          String
  tipo            TipoCentro?  // PARTICULAR, SLEP, etc.
  convenio        String?
  // ... campos básicos
}

enum TipoCentro {
  PARTICULAR
  PARTICULAR_SUBVENCIONADO
  SLEP
}
```

#### Después:
```prisma
model Empresa {
  id                Int              @id @default(autoincrement())
  rut               String           @unique
  razonSocial       String
  nombreFantasia    String?
  tipo              TipoEmpresa      // PUBLICA, PRIVADA, ONG, etc.
  tamano            TamanoEmpresa?   // MICRO, PEQUENA, MEDIANA, GRANDE
  sector            String?          // Sector económico
  estado            EstadoEmpresa
  tieneConvenio     Boolean
  fechaConvenio     DateTime?
  cuposPracticas    Int?
  // ... muchos más campos
}
```

**Campos nuevos importantes:**
- `rut` (obligatorio, único)
- `razonSocial` (nombre legal)
- `nombreFantasia` (nombre comercial)
- `tamano` (clasificación por tamaño)
- `sector` (industria/área)
- `estado` (gestión del ciclo de vida)
- `cuposPracticas` (capacidad)

---

### 2. Colaborador + TrabajadorEduc → SupervisorEmpresa

#### Antes (2 modelos separados):
```prisma
model Colaborador {
  rut               String     @unique
  nombre            String
  tipo              TipoColaborador?  // Colaborador, Supervisor, Tallerista
}

model TrabajadorEduc {
  rut       String  @unique
  nombre    String
  rol       String?
  centroId  Int
}
```

#### Después (consolidado):
```prisma
model SupervisorEmpresa {
  id                Int              @id @default(autoincrement())
  usuarioId         Int?             @unique  // ¡Vinculado a Usuario!
  rut               String           @unique
  nombre            String
  email             String
  rol               RolSupervisor    // Enum específico
  cargo             String?
  empresaId         Int              // Vinculado a Empresa
  area              String?
  profesion         String?
  aniosExperiencia  Int?
  // ...
}

enum RolSupervisor {
  SUPERVISOR_DIRECTO
  JEFE_AREA
  GERENTE
  COORDINADOR
  TUTOR
}
```

**Mejoras:**
- ✅ Unificación de supervisores/colaboradores
- ✅ Vinculación con sistema de usuarios
- ✅ Roles más específicos
- ✅ Información profesional expandida

---

### 3. Estudiante (Actualizado)

#### Campos removidos:
```diff
- anio_nacimiento       DateTime?
- puntaje_ponderado     Float?
- puntaje_psu           Float?
- promedio              Float?
- sistema_ingreso       String?
- numero_inscripciones  Int?
- avance                Float?
- plan                  String?
```

#### Campos nuevos/modificados:
```diff
+ id                    Int       @id @default(autoincrement())
+ usuarioId             Int?      @unique  // Vinculado a Usuario
+ carrera               String    // Renombrado de 'plan'
+ mencion               String?
+ semestreActual        Int?
+ promedioGeneral       Float?    // Simplificado
+ fechaNacimiento       DateTime? // Renombrado
+ comuna                String?
+ region                String?
+ activo                Boolean
+ fechaRegistro         DateTime
```

**Ventajas:**
- ✅ Datos más relevantes para prácticas profesionales
- ✅ Integración con autenticación
- ✅ Información geográfica mejor estructurada

---

### 4. Practica (Rediseñado)

#### Antes:
```prisma
model Practica {
  id             Int             @id @default(autoincrement())
  estado         EstadoPractica
  estudianteRut  String
  centroId       Int
  colaboradorId  Int
  fecha_inicio   DateTime
  fecha_termino  DateTime?
  tipo           String?
}
```

#### Después:
```prisma
model Practica {
  id                Int              @id @default(autoincrement())
  codigo            String           @unique  // ¡Nuevo!
  estudianteId      Int
  empresaId         Int              // Antes 'centroId'
  supervisorId      Int              // Antes 'colaboradorId'
  tipo              TipoPractica     // Enum tipado
  carrera           String
  semestre          Int?
  horasTotales      Int?
  horasCompletadas  Int?
  areaAsignada      String?
  notaFinal         Float?
  comentariosSupervisor String?
  comentariosEstudiante String?
  urlInforme        String?
  creadoPor         String?
  // ... más campos de seguimiento
}
```

**Nuevas capacidades:**
- ✅ Código único de práctica
- ✅ Control de horas trabajadas
- ✅ Comentarios bidireccionales
- ✅ Enlaces a documentos
- ✅ Metadata de auditoría

---

### 5. CartaSolicitud + AuthorizationRequest → SolicitudAutorizacion

#### Antes (2 modelos):
```prisma
model CartaSolicitud {
  id              Int      @id
  numero_folio    String   @unique
  fecha           DateTime
  url_archivo     String?
}

model AuthorizationRequest {
  id               Int          @id
  code             String?
  institution      String
  practiceType     String
  studentsJson     Json
  status           RequestStatus
}
```

#### Después (consolidado y mejorado):
```prisma
model SolicitudAutorizacion {
  id                  Int              @id @default(autoincrement())
  codigo              String           @unique  // PHG-2025-001
  empresaId           Int
  nombreDestinatario  String
  cargoDestinatario   String
  ciudad              String
  fechaCarta          DateTime
  asunto              String           @db.Text
  tipoPractica        TipoPractica
  carrera             String
  fechaInicio         DateTime
  fechaTermino        DateTime
  estudiantesJson     Json
  cantidadEstudiantes Int
  nombreTutor         String?
  estado              EstadoSolicitud
  comentarios         String?
  urlDocumento        String?
  creadoPor           String?
  fechaCreacion       DateTime
  fechaEnvio          DateTime?
  fechaRespuesta      DateTime?
}
```

**Ventajas:**
- ✅ Modelo único y completo
- ✅ Vinculación directa con Empresa
- ✅ Seguimiento del ciclo de vida
- ✅ Metadata completa

---

### 6. Sistema de Usuario (Mejorado)

#### Antes:
```prisma
model Usuario {
  id          Int     @id
  nombre      String
  correo      String  @unique
  rol         String  // Texto libre
  contrasena  String
}
```

#### Después:
```prisma
model Usuario {
  id                Int              @id @default(autoincrement())
  rut               String           @unique  // ¡Nuevo!
  nombre            String
  email             String           @unique
  password          String
  rol               RolUsuario       // Enum tipado
  telefono          String?
  activo            Boolean
  fechaCreacion     DateTime
  ultimoAcceso      DateTime?
  
  // Relaciones según rol
  estudiante        Estudiante?
  supervisorEmpresa SupervisorEmpresa?
}

enum RolUsuario {
  ADMIN
  JEFE_CARRERA
  SECRETARIA
  ESTUDIANTE
  SUPERVISOR_EMPRESA
  VINCULACION
}
```

**Mejoras:**
- ✅ Roles bien definidos por enum
- ✅ RUT como identificador adicional
- ✅ Relaciones con entidades de dominio
- ✅ Metadatos de actividad

---

## 🔄 Nuevas Entidades

### ActividadPractica
```prisma
model ActividadPractica {
  id                Int      @id
  practicaId        Int
  titulo            String
  descripcion       String?
  horasAsignadas    Int?
  urlEvidencia      String?
  completada        Boolean
  validadaSupervisor Boolean
}
```

**Propósito:** Seguimiento detallado de tareas y actividades durante la práctica.

### AsistenciaPractica
```prisma
model AsistenciaPractica {
  id              Int      @id
  practicaId      Int
  fecha           DateTime
  horaEntrada     DateTime?
  horaSalida      DateTime?
  horasTrabajadas Float?
  presente        Boolean
  justificada     Boolean
}
```

**Propósito:** Control de asistencia y cálculo de horas efectivas.

### Sistema de Encuestas Mejorado
- `Pregunta` - Preguntas reutilizables con tipos
- `Alternativa` - Opciones de respuesta
- `EncuestaEstudiante` - Evaluación de la experiencia
- `EncuestaSupervisor` - Evaluación del desempeño
- `RespuestaEstudiante` / `RespuestaSupervisor` - Respuestas individuales

---

## 📝 Script de Migración de Datos

```sql
-- ============================================
-- SCRIPT DE MIGRACIÓN (EJEMPLO)
-- De modelo pedagógico a multi-empresa
-- ============================================

-- 1. Migrar CentroEducativo → Empresa
INSERT INTO empresa (
  rut, razonSocial, nombreFantasia, tipo, region, comuna, 
  direccion, telefono, email, estado, tieneConvenio
)
SELECT 
  CONCAT('99999999-', id) as rut,  -- Generar RUT temporal
  nombre as razonSocial,
  nombre as nombreFantasia,
  CASE 
    WHEN tipo = 'PARTICULAR' THEN 'PRIVADA'
    WHEN tipo = 'SLEP' THEN 'PUBLICA'
    ELSE 'EDUCATIVA'
  END as tipo,
  region, comuna, direccion, 
  CAST(telefono AS CHAR) as telefono,
  correo as email,
  'ACTIVA' as estado,
  CASE WHEN convenio IS NOT NULL THEN TRUE ELSE FALSE END as tieneConvenio
FROM centro_educativo;

-- 2. Migrar Colaborador + TrabajadorEduc → SupervisorEmpresa
INSERT INTO supervisor_empresa (
  rut, nombre, email, telefono, rol, cargo, empresaId, activo
)
SELECT DISTINCT
  c.rut, c.nombre, c.correo, 
  CAST(c.telefono AS CHAR),
  'SUPERVISOR_DIRECTO' as rol,
  c.cargo,
  (SELECT id FROM empresa WHERE razonSocial = 
    (SELECT nombre FROM centro_educativo LIMIT 1)) as empresaId,
  TRUE as activo
FROM colaborador c;

-- 3. Migrar Estudiante (actualizar campos)
ALTER TABLE estudiante 
  ADD COLUMN usuarioId INT,
  ADD COLUMN carrera VARCHAR(255),
  ADD COLUMN activo BOOLEAN DEFAULT TRUE,
  ADD COLUMN fechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP;

UPDATE estudiante SET carrera = plan WHERE plan IS NOT NULL;

-- 4. Actualizar Practica
ALTER TABLE practica
  ADD COLUMN codigo VARCHAR(50) UNIQUE,
  ADD COLUMN horasTotales INT,
  ADD COLUMN horasCompletadas INT DEFAULT 0;

UPDATE practica 
SET codigo = CONCAT('PRAC-', YEAR(fecha_inicio), '-', LPAD(id, 5, '0'));

-- 5. Migrar CartaSolicitud → SolicitudAutorizacion
INSERT INTO solicitud_autorizacion (
  codigo, ciudad, fechaCarta, estado, urlDocumento
)
SELECT 
  numero_folio as codigo,
  'Arica' as ciudad,
  fecha as fechaCarta,
  'ENVIADA' as estado,
  url_archivo as urlDocumento
FROM carta_solicitud;

-- Nota: Requiere completar campos manualmente después
```

---

## ⚠️ Consideraciones Importantes

### Datos que Requieren Atención Manual

1. **RUTs de Empresas**
   - Validar y actualizar RUTs generados automáticamente
   - Obtener RUTs reales de las instituciones

2. **Tipos de Empresa**
   - Revisar la clasificación asignada automáticamente
   - Ajustar según corresponda

3. **Vinculación Usuario-Estudiante**
   - Crear usuarios para estudiantes existentes
   - Establecer las relaciones `usuarioId`

4. **Supervisores**
   - Validar asignación de supervisores a empresas
   - Crear usuarios para supervisores que requieran acceso

5. **Solicitudes Incompletas**
   - Completar campos faltantes en solicitudes migradas
   - Asociar con empresas correctas

### Campos Deprecados (No Migrados)

Los siguientes campos **NO** se migran al nuevo modelo:
- `puntaje_psu`
- `puntaje_ponderado`
- `sistema_ingreso`
- `numero_inscripciones`
- `avance`

**Motivo:** No son relevantes para el contexto multi-empresa.

---

## ✅ Checklist de Migración

### Pre-Migración
- [ ] Backup completo de la base de datos actual
- [ ] Validar integridad de datos existentes
- [ ] Documentar datos faltantes o inconsistentes
- [ ] Preparar RUTs reales de empresas

### Migración
- [ ] Ejecutar script de migración en entorno de prueba
- [ ] Validar conteo de registros migrados
- [ ] Verificar relaciones (foreign keys)
- [ ] Completar campos obligatorios faltantes
- [ ] Crear usuarios para roles nuevos

### Post-Migración
- [ ] Verificar funcionalidad en frontend
- [ ] Probar flujos de trabajo completos
- [ ] Actualizar documentación de usuario
- [ ] Capacitar equipo en nuevo modelo
- [ ] Monitorear logs y errores

---

## 🚀 Pasos Siguientes

1. **Aplicar nuevo schema de Prisma**
   ```bash
   npx prisma db push
   ```

2. **Ejecutar script de migración de datos**
   - Usar phpMyAdmin o consola MySQL
   - Ejecutar sección por sección
   - Validar cada paso

3. **Actualizar código del backend**
   - Modificar servicios y controladores
   - Actualizar DTOs
   - Ajustar validaciones

4. **Actualizar frontend**
   - Adaptar componentes
   - Actualizar llamadas a API
   - Revisar formularios

5. **Pruebas exhaustivas**
   - Pruebas unitarias
   - Pruebas de integración
   - Pruebas de usuario (UAT)

---

**Fecha de migración planeada:** Por definir
**Responsable técnico:** Equipo de desarrollo
**Tiempo estimado:** 2-3 semanas

---

Para consultas: soporte-tecnico@institucion.cl
