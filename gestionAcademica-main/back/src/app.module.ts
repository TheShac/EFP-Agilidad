import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { PrismaModule } from '../prisma/prisma.module';

// TODO: Módulos deshabilitados temporalmente - requieren migración
// import { AuthorizationRequestsModule } from './authorization-requests/authorization-requests.module';
import { ColaboradoresModule } from './colaboradores/colaboradores.module';
import { CentrosModule } from './centros/centros.module';
// import { TrabajadorModule } from './trabajador/trabajador.module'; // Tabla eliminada
import { PracticasModule } from './practicas/practicas.module';
import { EstudianteModule } from './estudiante/estudiante.module';
// import { CartaModule } from './carta/carta.module'; // Requiere actualización

@Module({
  imports: [
    PrismaModule,                // Global
    // AuthorizationRequestsModule, // ❌ Deshabilitado - tabla no existe
    ColaboradoresModule,         // ⚠️ Requiere actualización
    CentrosModule,               // ⚠️ Requiere actualización
    // TrabajadorModule,         // ❌ Deshabilitado - tabla eliminada
    PracticasModule,             // ⚠️ Requiere actualización
    EstudianteModule,            // ✅ Parcialmente corregido
    // CartaModule,              // ❌ Deshabilitado - requiere actualización
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
