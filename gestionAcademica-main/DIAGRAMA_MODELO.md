# 📐 Diagrama del Modelo Multi-Empresa

## Estructura de Relaciones

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         SISTEMA MULTI-EMPRESA                           │
│                   Gestión de Prácticas Profesionales                    │
└─────────────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────────────┐
│                          NÚCLEO PRINCIPAL                                 │
└──────────────────────────────────────────────────────────────────────────┘

                    ┌─────────────────┐
                    │    USUARIO      │◄─── Autenticación Centralizada
                    │                 │
                    │ - rut           │
                    │ - email         │
                    │ - password      │
                    │ - rol (enum)    │
                    └────┬──────┬─────┘
                         │      │
           ┌─────────────┘      └────────────┐
           │                                 │
           ▼                                 ▼
    ┌──────────────┐                 ┌────────────────────┐
    │  ESTUDIANTE  │                 │ SUPERVISOR_EMPRESA │
    │              │                 │                    │
    │ - carrera    │                 │ - empresaId (FK)   │
    │ - mencion    │                 │ - rol (enum)       │
    │ - semestre   │                 │ - cargo            │
    └──────┬───────┘                 └─────────┬──────────┘
           │                                   │
           │                                   │
           └─────────────┐     ┌───────────────┘
                         │     │
                         ▼     ▼
                    ┌────────────────┐
                    │   PRACTICA     │◄─── Asignación
                    │                │
                    │ - codigo       │
                    │ - estudianteId │
                    │ - empresaId    │
                    │ - supervisorId │
                    │ - tipo (enum)  │
                    │ - estado       │
                    │ - horas        │
                    └────┬──────┬────┘
                         │      │
           ┌─────────────┘      └────────────┐
           │                                 │
           ▼                                 ▼
    ┌──────────────────┐           ┌──────────────────┐
    │ ACTIVIDAD        │           │   ASISTENCIA     │
    │ PRACTICA         │           │   PRACTICA       │
    │                  │           │                  │
    │ - titulo         │           │ - fecha          │
    │ - horas          │           │ - horaEntrada    │
    │ - validada       │           │ - horaSalida     │
    └──────────────────┘           │ - presente       │
                                   └──────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│                        GESTIÓN DE EMPRESAS                                │
└──────────────────────────────────────────────────────────────────────────┘

    ┌──────────────────────────────┐
    │         EMPRESA              │◄─── Multi-Empresa Core
    │                              │
    │ - rut (único)                │
    │ - razonSocial                │
    │ - tipo (enum)                │
    │ - tamano (enum)              │
    │ - sector                     │
    │ - estado (enum)              │
    │ - tieneConvenio              │
    │ - cuposPracticas             │
    └────┬────────┬────────────────┘
         │        │
         │        └──────────────────┐
         │                           │
         ▼                           ▼
    ┌──────────────────┐    ┌─────────────────────┐
    │ SUPERVISOR       │    │    SOLICITUD        │
    │ EMPRESA          │    │    AUTORIZACION     │
    │                  │    │                     │
    │ - empresaId (FK) │    │ - codigo (único)    │
    │ - rol            │    │ - empresaId (FK)    │
    │ - area           │    │ - destinatario      │
    └──────────────────┘    │ - estado (enum)     │
                            │ - estudiantesJson   │
                            │ - urlDocumento      │
                            └─────────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│                      SISTEMA DE ENCUESTAS                                 │
└──────────────────────────────────────────────────────────────────────────┘

    ┌──────────────┐
    │   PREGUNTA   │
    │              │
    │ - descripcion│
    │ - tipo       │
    │ - categoria  │
    └──┬───────┬───┘
       │       │
       │       └─────────────────┐
       ▼                         │
    ┌──────────────┐             │
    │ ALTERNATIVA  │             │
    │              │             │
    │ - descripcion│             │
    │ - puntaje    │             │
    └──────────────┘             │
                                 │
       ┌─────────────────────────┴───────────────────┐
       │                                             │
       ▼                                             ▼
┌──────────────────┐                      ┌───────────────────┐
│    ENCUESTA      │                      │    ENCUESTA       │
│   ESTUDIANTE     │                      │   SUPERVISOR      │
│                  │                      │                   │
│ - practicaId     │                      │ - practicaId      │
│ - observaciones  │                      │ - cumplePerfil    │
└────────┬─────────┘                      │ - sugerencias     │
         │                                └─────────┬─────────┘
         │                                          │
         ▼                                          ▼
┌──────────────────┐                      ┌───────────────────┐
│    RESPUESTA     │                      │    RESPUESTA      │
│   ESTUDIANTE     │                      │   SUPERVISOR      │
│                  │                      │                   │
│ - preguntaId     │                      │ - preguntaId      │
│ - respuestaTexto │                      │ - respuestaNumero │
└──────────────────┘                      └───────────────────┘


┌──────────────────────────────────────────────────────────────────────────┐
│                           FLUJO GENERAL                                   │
└──────────────────────────────────────────────────────────────────────────┘

1. VINCULACIÓN registra EMPRESA
   │
   ├── Define tipo, tamaño, sector
   ├── Registra datos de contacto
   ├── Carga convenio (si existe)
   └── Asigna SUPERVISORES a la empresa
   
2. VINCULACIÓN crea SOLICITUD DE AUTORIZACIÓN
   │
   ├── Selecciona empresa destino
   ├── Define tipo de práctica y fechas
   ├── Agrega lista de estudiantes
   ├── Genera PDF estandarizado
   └── Envía documento

3. JEFATURA asigna PRÁCTICA
   │
   ├── Selecciona estudiante
   ├── Selecciona empresa receptora
   ├── Asigna supervisor de empresa
   ├── Define periodo y tipo
   └── Genera código único

4. ESTUDIANTE realiza práctica
   │
   ├── Registra ACTIVIDADES diarias
   ├── Registra ASISTENCIA
   ├── Sube evidencias
   └── SUPERVISOR valida actividades

5. FINALIZACIÓN
   │
   ├── ESTUDIANTE responde ENCUESTA sobre empresa
   ├── SUPERVISOR responde ENCUESTA sobre estudiante
   ├── Se calcula nota final
   └── Se generan certificados/informes


┌──────────────────────────────────────────────────────────────────────────┐
│                          ROLES Y ACCESOS                                  │
└──────────────────────────────────────────────────────────────────────────┘

ADMIN
├── Acceso total al sistema
├── Gestión de usuarios
├── Configuración general
└── Reportes globales

JEFE_CARRERA
├── Ver todas las prácticas
├── Asignar prácticas
├── Ver reportes de carrera
├── Gestionar estudiantes
└── Aprobar/rechazar solicitudes

VINCULACION
├── Gestionar empresas
├── Crear/editar convenios
├── Crear solicitudes de autorización
├── Generar documentos
└── Ver reportes de vinculación

SECRETARIA
├── Registrar empresas
├── Crear solicitudes
├── Gestionar documentos
└── Soporte administrativo

ESTUDIANTE
├── Ver sus prácticas
├── Registrar actividades
├── Registrar asistencia
├── Subir evidencias
└── Responder encuestas

SUPERVISOR_EMPRESA
├── Ver practicantes asignados
├── Validar actividades
├── Registrar asistencia
├── Evaluar desempeño
└── Responder encuestas


┌──────────────────────────────────────────────────────────────────────────┐
│                      ESTADÍSTICAS DEL MODELO                              │
└──────────────────────────────────────────────────────────────────────────┘

📊 Total de Tablas: 15
📊 Total de Enums: 9
📊 Total de Relaciones: 22+
📊 Total de Índices: 25+

✅ Soporte Multi-Empresa: Ilimitado
✅ Soporte Multi-Carrera: Ilimitado
✅ Tipos de Práctica: 5 (extensible)
✅ Roles de Usuario: 6
✅ Estados de Empresa: 5
✅ Estados de Práctica: 5

```

---

## 🎯 Ventajas del Nuevo Modelo

### 1. **Escalabilidad**
- ✅ Soporta múltiples empresas sin límite
- ✅ Soporta múltiples carreras/programas
- ✅ Crece con la institución

### 2. **Flexibilidad**
- ✅ Adaptable a diferentes sectores económicos
- ✅ Soporta diferentes tipos de prácticas
- ✅ Configurable por roles

### 3. **Control**
- ✅ Trazabilidad completa
- ✅ Auditoría de cambios
- ✅ Estados bien definidos

### 4. **Integridad**
- ✅ Relaciones fuertes (Foreign Keys)
- ✅ Validaciones a nivel de base de datos
- ✅ Datos consistentes

### 5. **Reportabilidad**
- ✅ Múltiples dimensiones de análisis
- ✅ KPIs por empresa, carrera, supervisor
- ✅ Tendencias históricas

---

**Modelo diseñado para**: Instituciones educativas con múltiples programas y convenios empresariales
**Fecha de diseño**: 27 de Noviembre de 2025
**Versión**: 2.0.0 - Multi-Empresa
