# Actualizaciones Pendientes del Frontend

## Estado Actual
✅ Backend completamente actualizado al modelo multi-empresa
✅ Servicios de frontend (centros-api, colaboradores, practicas) actualizados
⏳ Componentes de frontend requieren actualización

## Cambios Necesarios en Componentes

### 1. centros-educativos.component.ts
**Imports a cambiar:**
```typescript
// Antes:
import { CentroEducativoDTO, TrabajadorDTO } from '../../services/centros-api.service';

// Después:
import { EmpresaDTO, SupervisorDTO, TipoEmpresa, TamanoEmpresa, EstadoEmpresa } from '../../services/centros-api.service';
```

**Interfaces a actualizar:**
```typescript
// Antes:
interface CentroEducativo {
  nombre: string;
  tipo: 'PARTICULAR' | 'PARTICULAR_SUBVENCIONADO' | 'SLEP';
  convenio?: string;
  calle?: string;
  numero?: number;
  correo?: string;
}

// Después:
interface Empresa {
  rut: string;
  razonSocial: string;
  nombreFantasia?: string;
  tipo: TipoEmpresa; // 'PRIVADA' | 'PUBLICA' | 'MIXTA' | 'ONG'
  tamano?: TamanoEmpresa; // 'MICRO' | 'PEQUENA' | 'MEDIANA' | 'GRANDE'
  region: string;
  comuna: string;
  email?: string;
  telefono?: string;
  sitioWeb?: string;
  estado?: EstadoEmpresa; // 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA'
}
```

**Campos de formulario a actualizar:**
- `nombre` → `razonSocial` (requerido) + `nombreFantasia` (opcional)
- Agregar campo `rut` (requerido, único)
- `tipo`: cambiar opciones a PRIVADA, PUBLICA, MIXTA, ONG
- Agregar campo `tamano`: MICRO, PEQUENA, MEDIANA, GRANDE
- Agregar campo `estado`: ACTIVA, INACTIVA, SUSPENDIDA
- `correo` → `email`
- Eliminar: `convenio`, `calle`, `numero`, `url_rrss`
- Agregar: `sitioWeb`, `observaciones`

**Relaciones:**
- `trabajadores[]` → `supervisores[]` (SupervisorDTO)

### 2. colaboradores.component.ts
**Campos a actualizar:**
- `correo` → `email` (requerido)
- `telefono`: de `number` a `string`
- `tipo` → `rol` (RolSupervisor: SUPERVISOR_DIRECTO, TUTOR_ACADEMICO, COORDINADOR, EVALUADOR)
- Agregar campos: `area`, `profesion`, `aniosExperiencia`, `empresaId` (requerido)
- Eliminar: `direccion`, `universidad_egreso`

### 3. practicas.component.ts
**Campos a actualizar:**
- `fecha_inicio` → `fechaInicio`
- `fecha_termino` → `fechaTermino`
- `estudianteRut` → `estudianteId`
- `centroId` → `empresaId`
- `colaboradorId` → `supervisorId`
- Agregar campo: `carrera`
- Relaciones: `centro` → `empresa`, `colaborador` → `supervisor`

### 4. carta.component.ts
**Estado:** Módulo deshabilitado temporalmente
- Consolidar con solicitudes de autorización
- Actualizar cuando se implemente el nuevo módulo de SolicitudAutorizacion

## Pasos Siguientes

1. **Crear tipos compartidos** (opcional pero recomendado):
   ```typescript
   // front/src/app/types/empresa.types.ts
   export type TipoEmpresa = 'PRIVADA' | 'PUBLICA' | 'MIXTA' | 'ONG';
   export type TamanoEmpresa = 'MICRO' | 'PEQUENA' | 'MEDIANA' | 'GRANDE';
   export type EstadoEmpresa = 'ACTIVA' | 'INACTIVA' | 'SUSPENDIDA';
   export type RolSupervisor = 'SUPERVISOR_DIRECTO' | 'TUTOR_ACADEMICO' | 'COORDINADOR' | 'EVALUADOR';
   export type EstadoPractica = 'PENDIENTE' | 'EN_CURSO' | 'FINALIZADA' | 'RECHAZADA';
   ```

2. **Actualizar templates HTML**:
   - Reemplazar referencias a campos antiguos
   - Actualizar labels de formularios
   - Adaptar tablas y listas

3. **Actualizar validaciones**:
   - RUT de empresa (formato chileno)
   - Email requerido para supervisores
   - Validar selección de empresa antes de crear supervisor

4. **Testing**:
   - Probar CRUD completo de empresas
   - Probar CRUD completo de supervisores
   - Probar creación de prácticas con nuevos campos
   - Verificar filtros y búsquedas

## Notas Importantes

- El backend ya está funcionando en puerto 3000
- Los endpoints han cambiado:
  - `/centros` ahora maneja empresas
  - `/colaboradores` ahora maneja supervisores de empresa
- La base de datos tiene el nuevo schema sincronizado
- Los módulos antiguos (authorization-requests, carta, trabajador) están en `.backup/`

## Prioridades

1. **ALTA**: Actualizar centros-educativos.component (empresas)
2. **ALTA**: Actualizar colaboradores.component (supervisores)
3. **MEDIA**: Actualizar practicas.component
4. **BAJA**: Crear nuevo módulo para solicitudes (consolidar carta + authorization-requests)
