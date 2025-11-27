# Guía de Configuración de Prisma con XAMPP

## 📋 Requisitos Previos
- XAMPP instalado
- Node.js instalado

## 🚀 Pasos de Configuración

### 1. Iniciar XAMPP
1. Abre el **Panel de Control de XAMPP**
2. Inicia los módulos:
   - ✅ **Apache**
   - ✅ **MySQL**

### 2. Crear la Base de Datos

#### Opción A: Usando phpMyAdmin (Interfaz Gráfica)
1. Abre tu navegador y ve a: `http://localhost/phpmyadmin`
2. Haz clic en **"Nueva"** en el panel izquierdo
3. Nombre de la base de datos: `gestion_academica`
4. Cotejamiento: `utf8mb4_unicode_ci`
5. Haz clic en **"Crear"**

#### Opción B: Usando la Consola de MySQL
```bash
# Abre PowerShell y ejecuta:
cd "C:\xampp\mysql\bin"
.\mysql.exe -u root -p

# Dentro de MySQL, ejecuta:
CREATE DATABASE gestion_academica CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 3. Configurar el Archivo .env
El archivo `.env` ya está creado en la carpeta `back` con la siguiente configuración:

```env
DATABASE_URL="mysql://root:@localhost:3306/gestion_academica"
PORT=3000
```

**Notas importantes:**
- `root` es el usuario por defecto de XAMPP
- No hay contraseña por defecto (por eso está vacío después de `:`)
- `3306` es el puerto por defecto de MySQL
- `gestion_academica` es el nombre de la base de datos

**Si tu XAMPP tiene contraseña:**
```env
DATABASE_URL="mysql://root:TU_CONTRASEÑA@localhost:3306/gestion_academica"
```

### 4. Ejecutar las Migraciones de Prisma

Desde PowerShell, en la carpeta `back`:

```bash
cd "C:\Users\Ignacio Lopez\Documents\GitHub\EFP-Agilidad\gestionAcademica-main\back"

# Generar el cliente de Prisma
npm run prisma:generate

# Ejecutar las migraciones (crear las tablas)
npm run prisma:migrate

# O si prefieres forzar el push del esquema sin migraciones:
npx prisma db push
```

### 5. Verificar la Instalación

#### Verificar tablas creadas:
1. Ve a phpMyAdmin: `http://localhost/phpmyadmin`
2. Selecciona la base de datos `gestion_academica`
3. Deberías ver todas las tablas creadas:
   - estudiante
   - practica
   - centro_educativo
   - colaborador
   - actividad
   - usuario
   - carta_solicitud
   - pregunta
   - alternativa
   - encuesta_estudiante
   - encuesta_colaborador
   - etc.

#### Verificar conexión desde Prisma Studio:
```bash
npx prisma studio
```
Esto abrirá una interfaz web en `http://localhost:5555` donde puedes ver y editar los datos.

### 6. Iniciar el Servidor Backend

```bash
# Modo desarrollo
npm run start:dev

# O modo producción
npm run start:prod
```

## 🔧 Solución de Problemas Comunes

### Error: "Can't connect to MySQL server"
- ✅ Verifica que MySQL esté ejecutándose en XAMPP
- ✅ Verifica que el puerto sea el correcto (3306)
- ✅ Verifica el usuario y contraseña en `.env`

### Error: "Database does not exist"
- ✅ Crea la base de datos manualmente en phpMyAdmin
- ✅ Verifica que el nombre coincida con el del `.env`

### Error: "Access denied for user"
- ✅ Verifica el usuario y contraseña en `.env`
- ✅ Por defecto XAMPP usa `root` sin contraseña

### El puerto 3306 está ocupado
Si tienes otro MySQL instalado, cambia el puerto en XAMPP:
1. Abre `xampp-control.exe`
2. Click en **Config** de MySQL → `my.ini`
3. Cambia el puerto (ej: 3307)
4. Actualiza el `.env`: `DATABASE_URL="mysql://root:@localhost:3307/gestion_academica"`

## 📚 Comandos Útiles de Prisma

```bash
# Ver el estado de las migraciones
npx prisma migrate status

# Resetear la base de datos (¡CUIDADO! Borra todos los datos)
npx prisma migrate reset

# Generar el cliente de Prisma
npx prisma generate

# Abrir Prisma Studio (GUI para ver datos)
npx prisma studio

# Validar el esquema
npx prisma validate

# Formatear el schema.prisma
npx prisma format
```

## 🎯 Próximos Pasos

1. ✅ Ejecuta las migraciones
2. ✅ Verifica que las tablas se crearon
3. ✅ Opcionalmente, carga datos de prueba (seed)
4. ✅ Inicia el servidor backend
5. ✅ Prueba los endpoints de la API

## 🌱 Cargar Datos de Prueba (Opcional)

Si tienes un archivo de seed:
```bash
npm run prisma:seed
```
