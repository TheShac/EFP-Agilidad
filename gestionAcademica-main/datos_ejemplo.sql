-- =====================================================
-- Datos de Ejemplo para gestion_academica
-- =====================================================

-- 1. Insertar usuarios del sistema
INSERT INTO usuario (nombre, correo, rol, contrasena) VALUES
('Admin Sistema', 'admin@efp.cl', 'ADMIN', '$2b$10$xxxxxxxxxxx'), -- Cambiar por hash real
('Coordinador Prácticas', 'coordinador@efp.cl', 'COORDINADOR', '$2b$10$xxxxxxxxxxx'),
('Secretaria', 'secretaria@efp.cl', 'SECRETARIA', '$2b$10$xxxxxxxxxxx');

-- 2. Insertar centros educativos
INSERT INTO centro_educativo (nombre, region, comuna, nombre_calle, numero_calle, telefono, correo, tipo, convenio) VALUES
('Liceo Técnico Profesional Arica', 'Arica y Parinacota', 'Arica', 'Av. Capitán Ávalos', 1245, 582123456, 'contacto@ltp-arica.cl', 'SLEP', 'SI'),
('Colegio Particular San José', 'Arica y Parinacota', 'Arica', 'Calle Patricio Lynch', 567, 582234567, 'info@sanjose.cl', 'PARTICULAR', 'SI'),
('Liceo Gabriela Mistral', 'Arica y Parinacota', 'Arica', 'Av. Santa María', 890, 582345678, 'contacto@gabrielamistral.cl', 'PARTICULAR_SUBVENCIONADO', 'SI');

-- 3. Insertar trabajadores de centros educativos
INSERT INTO trabajador_educ (rut, nombre, rol, correo, telefono, centroId) VALUES
('12345678-9', 'María González Pérez', 'Director(a)', 'mgonzalez@ltp-arica.cl', 987654321, 1),
('23456789-0', 'Juan Carlos Rojas', 'Jefe UTP', 'jrojas@ltp-arica.cl', 987654322, 1),
('34567890-1', 'Patricia Silva Muñoz', 'Directora', 'psilva@sanjose.cl', 987654323, 2),
('45678901-2', 'Roberto Fernández', 'Jefe UTP', 'rfernandez@gabrielamistral.cl', 987654324, 3);

-- 4. Insertar colaboradores (profesores supervisores y talleristas)
INSERT INTO colaborador (rut, nombre, correo, telefono, tipo, cargo, universidad_egreso) VALUES
('56789012-3', 'Dr. Carlos Mendoza López', 'cmendoza@universidad.cl', 987111222, 'Supervisor', 'Profesor Asociado', 'Universidad de Tarapacá'),
('67890123-4', 'Prof. Ana María Torres', 'atorres@efp.cl', 987222333, 'Colaborador', 'Profesora Guía', 'Universidad de Chile'),
('78901234-5', 'Mg. Luis Alberto Castro', 'lcastro@universidad.cl', 987333444, 'Tallerista', 'Docente', 'Pontificia Universidad Católica');

-- 5. Insertar estudiantes
INSERT INTO estudiante (rut, nombre, genero, anio_nacimiento, anio_ingreso, plan, avance, puntaje_ponderado, promedio, fono, email, direccion) VALUES
('19876543-2', 'Pedro Ramírez Soto', 'Masculino', '2003-05-15', 2021, 'Pedagogía en Educación Física', 65.5, 650.5, 5.8, 987555666, 'pedro.ramirez@estudiante.cl', 'Calle Los Aromos 123, Arica'),
('20987654-3', 'Carolina Vargas Muñoz', 'Femenino', '2002-08-22', 2020, 'Pedagogía en Educación Física', 85.2, 720.3, 6.2, 987666777, 'carolina.vargas@estudiante.cl', 'Av. General Velásquez 456, Arica'),
('21098765-4', 'Diego Morales Pérez', 'Masculino', '2003-11-10', 2021, 'Pedagogía en Educación Física', 72.8, 680.7, 5.9, 987777888, 'diego.morales@estudiante.cl', 'Pasaje San Marcos 789, Arica');

-- 6. Insertar prácticas
INSERT INTO practica (estado, fecha_inicio, fecha_termino, tipo, estudianteRut, centroId, colaboradorId) VALUES
('EN_CURSO', '2025-03-01', '2025-07-15', 'Práctica Pedagógica I', '19876543-2', 1, 1),
('EN_CURSO', '2025-03-15', '2025-07-30', 'Práctica Pedagógica II', '20987654-3', 2, 2),
('PENDIENTE', '2025-08-01', NULL, 'Práctica Profesional', '21098765-4', 3, 3);

-- 7. Insertar actividades de las prácticas
INSERT INTO actividad (titulo, descripcion, estado, fecha_registro, evidencia, rut, practicaId) VALUES
('Observación de clases', 'Observación de 10 clases de educación física en diferentes niveles', 'APROBADA', NOW(), 'https://drive.google.com/observaciones.pdf', '19876543-2', 1),
('Planificación de unidad didáctica', 'Planificación completa de una unidad de atletismo para 7° básico', 'APROBADA', NOW(), 'https://drive.google.com/planificacion.pdf', '19876543-2', 1),
('Ejecución de clases', 'Impartir 5 clases de gimnasia rítmica', 'PENDIENTE', NOW(), NULL, '20987654-3', 2),
('Diagnóstico institucional', 'Análisis del contexto educativo del centro', 'OBSERVADA', NOW(), 'https://drive.google.com/diagnostico.pdf', '21098765-4', 3);

-- 8. Insertar preguntas para encuestas
INSERT INTO pregunta (descripcion) VALUES
('¿Cómo califica la organización del centro educativo?'),
('¿El estudiante demuestra dominio de los contenidos pedagógicos?'),
('¿La comunicación con la universidad fue efectiva?'),
('¿Recomendaría este centro para futuras prácticas?'),
('¿El estudiante mostró compromiso y responsabilidad?');

-- 9. Insertar alternativas para las preguntas
INSERT INTO alternativa (descripcion, puntaje, preguntaId) VALUES
('Excelente', 5, 1), ('Bueno', 4, 1), ('Regular', 3, 1), ('Malo', 2, 1), ('Muy Malo', 1, 1),
('Totalmente de acuerdo', 5, 2), ('De acuerdo', 4, 2), ('Neutral', 3, 2), ('En desacuerdo', 2, 2),
('Excelente', 5, 3), ('Bueno', 4, 3), ('Regular', 3, 3), ('Deficiente', 2, 3),
('Sí, definitivamente', 5, 4), ('Probablemente sí', 4, 4), ('No estoy seguro', 3, 4), ('Probablemente no', 2, 4),
('Siempre', 5, 5), ('Frecuentemente', 4, 5), ('A veces', 3, 5), ('Raramente', 2, 5);

-- 10. Insertar carta de solicitud
INSERT INTO carta_solicitud (numero_folio, fecha, direccion_emisor, url_archivo) VALUES
('PHG-2025-001', '2025-02-15', 'Universidad de Tarapacá, Av. 18 de Septiembre 2222, Arica', 'https://drive.google.com/cartas/001.pdf'),
('PHG-2025-002', '2025-02-20', 'Universidad de Tarapacá, Av. 18 de Septiembre 2222, Arica', 'https://drive.google.com/cartas/002.pdf');

-- Verificar datos insertados
SELECT 'Estudiantes' as Tabla, COUNT(*) as Total FROM estudiante
UNION ALL SELECT 'Centros Educativos', COUNT(*) FROM centro_educativo
UNION ALL SELECT 'Colaboradores', COUNT(*) FROM colaborador
UNION ALL SELECT 'Prácticas', COUNT(*) FROM practica
UNION ALL SELECT 'Actividades', COUNT(*) FROM actividad
UNION ALL SELECT 'Usuarios', COUNT(*) FROM usuario;
