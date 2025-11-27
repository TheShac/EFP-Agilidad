-- =====================================================
-- Script de Verificación de Tablas
-- Base de datos: gestion_academica
-- =====================================================

-- Ver todas las tablas creadas
SHOW TABLES;

-- Verificar estructura de tablas principales
DESCRIBE estudiante;
DESCRIBE practica;
DESCRIBE centro_educativo;
DESCRIBE colaborador;
DESCRIBE actividad;
DESCRIBE usuario;

-- Contar registros en cada tabla
SELECT 'estudiante' as tabla, COUNT(*) as registros FROM estudiante
UNION ALL
SELECT 'practica', COUNT(*) FROM practica
UNION ALL
SELECT 'centro_educativo', COUNT(*) FROM centro_educativo
UNION ALL
SELECT 'colaborador', COUNT(*) FROM colaborador
UNION ALL
SELECT 'actividad', COUNT(*) FROM actividad
UNION ALL
SELECT 'usuario', COUNT(*) FROM usuario
UNION ALL
SELECT 'carta_solicitud', COUNT(*) FROM carta_solicitud
UNION ALL
SELECT 'pregunta', COUNT(*) FROM pregunta
UNION ALL
SELECT 'alternativa', COUNT(*) FROM alternativa
UNION ALL
SELECT 'encuesta_estudiante', COUNT(*) FROM encuesta_estudiante
UNION ALL
SELECT 'encuesta_colaborador', COUNT(*) FROM encuesta_colaborador
UNION ALL
SELECT 'trabajador_educ', COUNT(*) FROM trabajador_educ
UNION ALL
SELECT 'AuthorizationRequest', COUNT(*) FROM AuthorizationRequest;

-- Ver información de la base de datos
SELECT 
    TABLE_NAME as 'Tabla',
    TABLE_ROWS as 'Filas',
    ROUND((DATA_LENGTH + INDEX_LENGTH) / 1024, 2) as 'Tamaño (KB)',
    ENGINE as 'Motor'
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = 'gestion_academica'
ORDER BY TABLE_NAME;
