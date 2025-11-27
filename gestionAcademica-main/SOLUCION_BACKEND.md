# ⚠️ SOLUCIÓN RÁPIDA: Backend con Errores

## 🔴 Problema Actual

El backend tiene **49 errores de TypeScript** porque el código usa las tablas del modelo antiguo:
- `centroEducativo` → Ya no existe (ahora es `empresa`)
- `colaborador` → Ya no existe (ahora es `supervisorEmpresa`)
- `trabajadorEduc` → Ya no existe (consolidado en `supervisorEmpresa`)
- `AuthorizationRequest` → Ya no existe (ahora es `solicitudAutorizacion`)
- Campos como `fono`, `fecha_inicio`, `estudianteRut` cambiaron nombres

## ✅ Soluciones (Elige una)

### OPCIÓN 1: Usar el Schema Antiguo Temporalmente ⏱️
**Tiempo:** 5 minutos  
**Ventaja:** El backend funciona inmediatamente  
**Desventaja:** No usas el nuevo modelo multi-empresa

```bash
cd back

# 1. Restaurar el schema antiguo (crear backup primero)
git checkout HEAD -- prisma/schema.prisma

# 2. Aplicar a la BD
npx prisma db push --force-reset

# 3. Regenerar cliente
npx prisma generate

# 4. Iniciar servidor
npm run start:dev
```

### OPCIÓN 2: Actualizar el Backend Completo 🛠️
**Tiempo:** 2-3 días  
**Ventaja:** Sistema multi-empresa funcionando  
**Desventaja:** Requiere actualizar muchos archivos

Ver [`PLAN_DE_ACCION.md`](../PLAN_DE_ACCION.md) para los pasos detallados.

#### Archivos que necesitan actualización:

1. **Renombrar módulos** (30 min):
   ```
   src/centros/          → src/empresas/
   src/colaboradores/    → src/supervisores/
   src/trabajador/       → ELIMINAR (consolidado)
   ```

2. **Actualizar servicios** (2 días):
   - `empresas.service.ts` (antes centros)
   - `supervisores.service.ts` (antes colaboradores)
   - `practicas.service.ts` (actualizar relaciones)
   - `estudiantes.service.ts` (actualizar campos)
   - `solicitudes.service.ts` (consolidar authorization-requests + carta)

3. **Actualizar DTOs** (1 día):
   - Cambiar nombres de campos
   - Actualizar enums
   - Agregar campos nuevos

### OPCIÓN 3: Migración Gradual (RECOMENDADA) 🎯
**Tiempo:** 1 semana  
**Ventaja:** Backend funcional mientras migras  
**Desventaja:** Requiere mantener compatibilidad

#### Paso a Paso:

**DÍA 1: Preparar entorno**
```bash
# 1. Crear rama de migración
git checkout -b migracion-multi-empresa

# 2. Mantener schema nuevo
# (ya está aplicado)

# 3. Crear adaptadores de compatibilidad
```

**DÍA 2-3: Actualizar módulos uno por uno**
1. Estudiantes (más simple)
2. Empresas (antes Centros)
3. Supervisores (antes Colaboradores)
4. Prácticas
5. Solicitudes

**DÍA 4-5: Testing**
1. Probar cada endpoint
2. Verificar relaciones
3. Validar datos

## 🚀 SOLUCIÓN INMEDIATA PARA DESARROLLO

Si necesitas el backend funcionando **AHORA** para seguir desarrollando:

### Script de Corrección Rápida

```bash
cd back

# 1. Comentar módulos problemáticos temporalmente
# Edita src/app.module.ts y comenta:
# - TrabajadorModule
# - CartaModule  
# - AuthorizationRequestsModule

# 2. Regenerar cliente
npx prisma generate

# 3. Iniciar (con errores pero funcional en rutas básicas)
npm run start:dev
```

### Editar app.module.ts:

```typescript
@Module({
  imports: [
    PrismaModule,
    // AuthorizationRequestsModule,  // ❌ Comentado temporalmente
    ColaboradoresModule,  // ⚠️ Tiene errores pero no críticos
    CentrosModule,        // ⚠️ Tiene errores pero no críticos  
    // TrabajadorModule,  // ❌ Comentado (tabla no existe)
    PracticasModule,      // ⚠️ Tiene errores pero puede funcionar parcialmente
    EstudianteModule,     // ✅ Corregido
    // CartaModule,       // ❌ Comentado temporalmente
  ],
})
export class AppModule {}
```

## 📋 Lista de Cambios Necesarios

### Cambios de Nombres de Tablas

| Antiguo | Nuevo | Estado |
|---------|-------|--------|
| `centroEducativo` | `empresa` | ⚠️ Requiere actualización |
| `colaborador` | `supervisorEmpresa` | ⚠️ Requiere actualización |
| `trabajadorEduc` | `supervisorEmpresa` | ⚠️ Consolidado |
| `AuthorizationRequest` | `solicitudAutorizacion` | ⚠️ Requiere actualización |
| `CartaSolicitud` | `solicitudAutorizacion` | ⚠️ Consolidado |
| `Actividad` | `actividadPractica` | ⚠️ Requiere actualización |

### Cambios de Nombres de Campos

| Tabla | Campo Antiguo | Campo Nuevo |
|-------|---------------|-------------|
| `estudiante` | `fono` | `telefono` |
| `practica` | `fecha_inicio` | `fechaInicio` |
| `practica` | `fecha_termino` | `fechaTermino` |
| `practica` | `estudianteRut` | `estudianteId` |
| `practica` | `centroId` | `empresaId` |
| `practica` | `colaboradorId` | `supervisorId` |

### Cambios de Enums

| Antiguo | Nuevo |
|---------|-------|
| `TipoColaborador` | `RolSupervisor` |
| `TipoCentro` | `TipoEmpresa` |
| `RequestStatus` | `EstadoSolicitud` |

## 🎯 Mi Recomendación

Para continuar desarrollando **sin bloquear tu trabajo**:

1. **HOY**: Usa la OPCIÓN 1 (schema antiguo) para seguir trabajando
2. **ESTA SEMANA**: Planifica la migración gradual
3. **PRÓXIMA SEMANA**: Ejecuta la migración módulo por módulo

## 📞 Ayuda Específica

¿Qué quieres hacer?

A) Volver al schema antiguo para seguir trabajando → Te ayudo en 5 min
B) Empezar la migración gradual → Te guío paso a paso  
C) Actualizar un módulo específico primero → Dime cuál

---

**Creado**: 27 de Noviembre de 2025  
**Estado**: Backend con 49 errores de compilación  
**Acción recomendada**: Opción A para desarrollo inmediato
