-- ================================================================
-- AULASYNC - INCREMENTO 1 (VERSION SIMPLE PARA APRENDER)
-- Motor: MySQL 8.x
-- Objetivo: consultar horarios ficticios y sus requerimientos.
-- Este esquema de 4 tablas es TEMPORAL y NO sustituye el modelo
-- completo de AulaSync. En el incremento 1 el frontend puede usar
-- archivos TypeScript/JSON sin conectar a MySQL.
-- Ejecutar UNA VEZ en MySQL Workbench. No borra bases existentes.
-- ================================================================

-- PASO 1. Crear una base de pruebas independiente.
CREATE DATABASE IF NOT EXISTS aulasync_i1
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE aulasync_i1;

-- PASO 2. Crear las cuatro tablas.

-- Calendarios de origen (por ahora con nombres ficticios).
CREATE TABLE IF NOT EXISTS calendarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(20) NOT NULL,    -- equipamiento / informativo
    google_calendar_id VARCHAR(255) NULL,
    color VARCHAR(7) NULL
);

-- Aulas donde se programan actividades.
CREATE TABLE IF NOT EXISTS aulas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    codigo VARCHAR(20) NOT NULL UNIQUE,
    nombre VARCHAR(100) NULL
);

-- Eventos originales: no asumimos que todos son clases.
CREATE TABLE IF NOT EXISTS eventos_origen (
    id INT AUTO_INCREMENT PRIMARY KEY,
    calendario_id INT NOT NULL,
    aula_id INT NULL,                  -- NULL = aula sin especificar
    titulo_original VARCHAR(255) NOT NULL,
    descripcion_original TEXT NULL,
    inicio DATETIME NOT NULL,
    fin DATETIME NOT NULL,
    clasificacion VARCHAR(20) NOT NULL,

    FOREIGN KEY (calendario_id) REFERENCES calendarios(id),
    FOREIGN KEY (aula_id) REFERENCES aulas(id)
);

-- Equipos solicitados por cada evento.
-- En incrementos posteriores se separaran las clases, los tipos de
-- equipo y las tareas operativas; aqui solo se muestran los datos.
CREATE TABLE IF NOT EXISTS requerimientos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,
    equipo VARCHAR(60) NOT NULL,
    cantidad INT NULL,               -- NULL = cantidad desconocida

    FOREIGN KEY (evento_id) REFERENCES eventos_origen(id)
);

-- PASO 3. Insertar DATOS FICTICIOS para practicar.
-- No son horarios, IDs ni solicitudes reales de Google Calendar.
-- Estos INSERT se ejecutan solo la primera vez.
INSERT INTO calendarios (id, nombre, categoria, color) VALUES
(1, 'A Movil Cursos', 'equipamiento', NULL),
(2, 'E Proyectores', 'equipamiento', NULL),
(3, 'E Bloomberg', 'equipamiento', NULL),
(4, 'OTROS', 'equipamiento', NULL),
(5, 'Dias feriados en Peru', 'informativo', NULL);

INSERT INTO aulas (id, codigo, nombre) VALUES
(1, 'A-201', 'Aula 201'),
(2, 'A-202', 'Aula 202'),
(3, 'A-203', 'Aula 203');

INSERT INTO eventos_origen
(id, calendario_id, aula_id, titulo_original, descripcion_original,
 inicio, fin, clasificacion) VALUES
(1, 1, 1, '20, A-201, Ingenieria Clinica', NULL,
 '2026-10-28 08:00:00', '2026-10-28 10:00:00', 'clase'),
(2, 2, 1, 'A-201, Ingenieria Clinica', NULL,
 '2026-10-28 08:00:00', '2026-10-28 10:00:00', 'clase'),
(3, 1, 2, '8, A-202, Estadistica', NULL,
 '2026-10-28 10:00:00', '2026-10-28 12:00:00', 'clase'),
(4, 4, NULL, 'Apoyar en biblioteca', NULL,
 '2026-10-28 11:00:00', '2026-10-28 12:00:00', 'informativo'),
(5, 3, 3, 'A-203, Practica con Bloomberg', NULL,
 '2026-10-28 14:00:00', '2026-10-28 16:00:00', 'clase'),
(6, 4, NULL, 'Revisar requerimiento pendiente', NULL,
 '2026-10-28 16:00:00', '2026-10-28 17:00:00', 'por_clasificar');

INSERT INTO requerimientos (evento_id, equipo, cantidad) VALUES
(1, 'Laptop', 20),
(2, 'Proyector', 1),
(3, 'Laptop', 8),
(5, 'PC Bloomberg', NULL);

-- PASO 4. Verificar las tablas.
SHOW TABLES;

-- PASO 5. Consultar el horario completo (incluye eventos sin equipo).
SELECT
    e.id AS evento,
    e.inicio,
    e.fin,
    COALESCE(a.codigo, 'Sin especificar') AS aula,
    e.titulo_original,
    c.nombre AS calendario,
    e.clasificacion,
    COALESCE(r.equipo, 'No especificado') AS equipo,
    COALESCE(CAST(r.cantidad AS CHAR), 'Sin especificar') AS cantidad
FROM eventos_origen AS e
JOIN calendarios AS c ON c.id = e.calendario_id
LEFT JOIN aulas AS a ON a.id = e.aula_id
LEFT JOIN requerimientos AS r ON r.evento_id = e.id
ORDER BY e.inicio, e.id;

-- Consultas adicionales para practicar manualmente:
-- SELECT * FROM aulas;
-- SELECT * FROM calendarios;
-- SELECT * FROM eventos_origen WHERE clasificacion = 'informativo';
-- SELECT * FROM requerimientos WHERE cantidad IS NULL;
