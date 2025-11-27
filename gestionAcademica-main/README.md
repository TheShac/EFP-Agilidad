# 🏢 Sistema Multi-Empresa de Gestión de Prácticas Profesionales

> **Versión 2.0.0 - Multi-Empresa**  
> Sistema integral para gestión de prácticas profesionales con múltiples empresas colaboradoras

**Proyecto III — Universidad de Tarapacá**  
**Carrera:** Ingeniería Civil en Computación e Informática

---

## 📖 Descripción General

El **Sistema Multi-Empresa de Gestión de Prácticas** es una plataforma completa para instituciones educativas que permite gestionar prácticas profesionales y pasantías con **múltiples empresas colaboradoras de diferentes sectores**.

### ✨ Transformación v2.0
Este sistema ha sido **completamente rediseñado** de un enfoque pedagógico específico a una **plataforma multi-empresa generalizada**, permitiendo:

- ✅ Gestión ilimitada de empresas de cualquier sector
- ✅ Control de convenios y vigencias
- ✅ Asignación inteligente de prácticas
- ✅ Seguimiento de horas y asistencia
- ✅ Evaluación bidireccional (estudiante ↔ empresa)
- ✅ Generación de documentos estandarizados

---

## 🎯 Características Principales

### 🏢 Multi-Empresa
- Soporte ilimitado de empresas colaboradoras
- Clasificación por tipo, tamaño y sector económico
- Gestión de convenios con fechas de vigencia
- Control de cupos de prácticas por empresa

### 📚 Gestión de Prácticas
- 5 tipos: Inicial, Intermedia, Profesional, Pasantía, Servicio Comunitario
- Control de horas trabajadas
- Sistema de actividades con evidencias
- Estados del ciclo de vida completo

### 👥 Sistema de Usuarios
- 6 roles: Admin, Jefe de Carrera, Secretaria, Estudiante, Supervisor, Vinculación
- Autenticación centralizada con JWT
- Permisos específicos por rol

### 📝 Documentación Automatizada
- Generación automática de cartas de solicitud
- PDFs estandarizados institucionales
- Seguimiento del ciclo de vida de solicitudes

---

---

## 🏗️ Arquitectura

### **Backend**
- **Framework**: NestJS (Node.js + TypeScript)
- **ORM**: Prisma ORM
- **Base de Datos**: MySQL / MariaDB (XAMPP)
- **Autenticación**: JWT (JSON Web Tokens)
- **Generación de PDFs**: Puppeteer

### **Frontend**
- **Framework**: Angular 19
- **Lenguaje**: TypeScript
- **Estilos**: CSS moderno

### **Base de Datos**
- **15 tablas** principales
- **9 enums** tipados para integridad
- **22+ relaciones** entre entidades
- Control completo de integridad referencial

---

## 📊 Modelo de Datos v2.0

### Entidades Principales

| Entidad | Descripción | Relaciones |
|---------|-------------|------------|
| **Usuario** | Sistema de autenticación | → Estudiante, SupervisorEmpresa |
| **Empresa** | Organizaciones colaboradoras | ← Supervisores, Prácticas, Solicitudes |
| **SupervisorEmpresa** | Tutores en empresas | → Empresa, Prácticas |
| **Estudiante** | Practicantes | → Prácticas |
| **Practica** | Asignaciones | → Empresa, Supervisor, Estudiante, Actividades, Asistencias |
| **SolicitudAutorizacion** | Documentos formales | → Empresa |
| **ActividadPractica** | Tareas y evidencias | → Practica |
| **AsistenciaPractica** | Control horario | → Practica |
| **Sistema de Encuestas** | Evaluaciones | Preguntas, Alternativas, Respuestas |

📚 **Documentación completa**: Ver [`MODELO_MULTI_EMPRESA.md`](MODELO_MULTI_EMPRESA.md)

---

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js 18+
- XAMPP (MySQL)
- Git

### 1. Clonar Repositorio

```bash
git clone https://github.com/TheShac/EFP-Agilidad.git
cd EFP-Agilidad/gestionAcademica-main
```

### 2. Backend

```bash
cd back

# Instalar dependencias
npm install

# Configurar base de datos
cp .env.example .env
# Editar .env: DATABASE_URL="mysql://root:@localhost:3306/gestion_practicas_empresas"

# Aplicar schema a BD
npx prisma db push

# Generar cliente
npx prisma generate

# (Opcional) Cargar datos de prueba
npx prisma db seed
```

### 3. Frontend

```bash
cd ../front

# Instalar dependencias
npm install

# Configurar API URL
# Editar src/environments/environment.ts
```

### 4. Ejecutar

**Terminal 1 - Backend:**
```bash
cd back
npm run start:dev  # http://localhost:3000
```

**Terminal 2 - Frontend:**
```bash
cd front
npm start  # http://localhost:4200
```

**Prisma Studio** (opcional):
```bash
npx prisma studio  # http://localhost:5555
```

📖 **Guía detallada**: Ver [`SETUP_PRISMA_XAMPP.md`](SETUP_PRISMA_XAMPP.md)

---

## 📚 Documentación Completa

| Documento | Contenido |
|-----------|-----------|
| [`MODELO_MULTI_EMPRESA.md`](MODELO_MULTI_EMPRESA.md) | Modelo de datos completo, enums, relaciones |
| [`GUIA_MIGRACION.md`](GUIA_MIGRACION.md) | Migración desde v1.0 a v2.0 |
| [`DIAGRAMA_MODELO.md`](DIAGRAMA_MODELO.md) | Diagramas visuales y flujos |
| [`PLAN_DE_ACCION.md`](PLAN_DE_ACCION.md) | Tareas pendientes y roadmap |
| [`RESUMEN_CAMBIOS.md`](RESUMEN_CAMBIOS.md) | Comparación antes/después |
| [`SETUP_PRISMA_XAMPP.md`](SETUP_PRISMA_XAMPP.md) | Configuración de base de datos |

---

## 🎯 Casos de Uso

### 1. Registro de Empresa
```
VINCULACIÓN registra empresa nueva
→ Completa RUT, razón social, tipo, sector
→ Sube documento de convenio
→ Asigna supervisores de la empresa
→ Estado: ACTIVA
```

### 2. Solicitud de Autorización
```
VINCULACIÓN crea solicitud formal
→ Selecciona empresa destino
→ Agrega estudiantes (JSON)
→ Genera PDF estandarizado automáticamente
→ Descarga/Envía documento
→ Estado: ENVIADA
```

### 3. Asignación de Práctica
```
JEFE DE CARRERA asigna práctica
→ Estudiante + Empresa + Supervisor
→ Define tipo, periodo, área
→ Sistema genera código único
→ Estado: PENDIENTE → EN_CURSO
```

### 4. Seguimiento Diario
```
ESTUDIANTE registra actividades
→ Título, descripción, horas, evidencias
→ Registra asistencia diaria

SUPERVISOR valida
→ Aprueba actividades
→ Confirma asistencia
→ Califica desempeño
```

---

## 👥 Roles y Permisos

| Rol | Acciones Permitidas |
|-----|---------------------|
| **ADMIN** | Configuración total, gestión de usuarios, acceso a todo |
| **JEFE_CARRERA** | Asignar prácticas, reportes, gestionar estudiantes |
| **VINCULACION** | Gestionar empresas, convenios, solicitudes |
| **SECRETARIA** | Soporte administrativo, documentos |
| **ESTUDIANTE** | Ver prácticas, registrar actividades y asistencia, encuestas |
| **SUPERVISOR_EMPRESA** | Validar actividades, asistencia, evaluar |

---

## 🔧 Comandos Útiles

### Prisma
```bash
npx prisma studio          # Interfaz visual de la BD
npx prisma generate        # Regenerar cliente
npx prisma db push         # Aplicar cambios al schema
npx prisma format          # Formatear schema.prisma
npx prisma validate        # Validar schema
```

### Backend
```bash
npm run start:dev          # Desarrollo con hot-reload
npm run build              # Compilar
npm run start:prod         # Producción
npm run test               # Tests
```

### Frontend
```bash
npm start                  # Servidor de desarrollo
npm run build              # Build de producción
npm run test               # Tests unitarios
```

---

## 📦 Estructura

```
gestionAcademica-main/
├── back/                       # Backend NestJS
│   ├── prisma/
│   │   ├── schema.prisma       # ⭐ Modelo de datos
│   │   └── seed.ts             # Datos de prueba
│   ├── src/
│   │   ├── empresas/           # CRUD empresas
│   │   ├── supervisores/       # CRUD supervisores
│   │   ├── estudiantes/        # CRUD estudiantes
│   │   ├── practicas/          # Gestión de prácticas
│   │   ├── solicitudes/        # Solicitudes de autorización
│   │   ├── actividades/        # Actividades
│   │   ├── asistencias/        # Control de asistencia
│   │   ├── encuestas/          # Sistema de encuestas
│   │   └── auth/               # Autenticación JWT
│   └── .env                    # ⚙️ Configuración
│
├── front/                      # Frontend Angular
│   └── src/app/
│       ├── components/
│       ├── services/
│       └── layout/
│
└── docs/                       # 📚 Documentación
    ├── MODELO_MULTI_EMPRESA.md
    ├── GUIA_MIGRACION.md
    ├── DIAGRAMA_MODELO.md
    ├── PLAN_DE_ACCION.md
    ├── RESUMEN_CAMBIOS.md
    └── SETUP_PRISMA_XAMPP.md
```

---

## 🚧 Estado del Proyecto

### ✅ Completado
- [x] Modelo de datos v2.0 diseñado
- [x] Schema de Prisma validado
- [x] Base de datos sincronizada (15 tablas)
- [x] Documentación completa
- [x] Configuración de XAMPP

### ⏳ En Progreso
- [ ] Adaptación del backend (módulos, DTOs, servicios)
- [ ] Adaptación del frontend (componentes, servicios)
- [ ] Módulo de autenticación JWT
- [ ] Sistema de encuestas

### 📅 Pendiente
- [ ] Tests unitarios e integración
- [ ] Dashboard con gráficos
- [ ] Exportación de reportes
- [ ] Notificaciones por email

📋 **Plan detallado**: Ver [`PLAN_DE_ACCION.md`](PLAN_DE_ACCION.md)

---

## 📈 Versiones

### v2.0.0 (Actual) - Multi-Empresa ⭐
- ✅ Modelo completamente rediseñado
- ✅ Soporte multi-empresa ilimitado
- ✅ 15 tablas, 9 enums, 22+ relaciones
- ✅ Control de horas y asistencia
- ✅ Gestión de convenios
- ✅ 6 roles diferenciados

### v1.0.0 (Anterior) - Pedagógico
- Sistema específico para prácticas pedagógicas
- Enfoque único en centros educativos

---  
- Librerías UI: Angular Material, Flex Layout  
- Estilo visual: Diseño limpio y adaptable (Responsive Design)  
- Funcionalidades destacadas:
  - Panel de gestión para cada rol (Jefatura, Vinculación, Prácticas)
  - Formularios dinámicos con validaciones reactivas
  - CRUD completo de entidades (Centros, Estudiantes, Supervisores, etc.)
  - Generación de cartas en PDF
  - Integración con backend vía servicios HTTP

### **Backend (NestJS + Prisma + MySQL)**
- Framework: NestJS  
- ORM: Prisma  
- Base de datos: MySQL (Azure Database for MySQL Server / XAMPP local)
- Lenguaje: TypeScript
- Arquitectura: Módulos, controladores y servicios desacoplados
- Seguridad: Validación DTO + control de errores HTTP  
- Funcionalidades principales:
  - API RESTful para todas las entidades
  - Control de relaciones (1:N, N:M)
  - Migraciones automáticas con Prisma
  - Generación de datos semilla (seeding)
  - Exportación de documentos y reportes

---

## Instalación y configuración

### **1. Clonar el repositorio**
```bash
git clone https://github.com/GaboNto/gestionAcademica.git
cd gestionAcademica
----
