# Parking Management APIREST

## Índice

1. [Descripción](#descripción)
2. [Características principales](#características-principales)
3. [Roles y Permisos](#roles-y-permisos)
   - Admin
   - Socio
4. [Instalación](#instalación)
   - Requisitos previos
   - Configuración inicial
   - Configuración de entorno
   - Base de datos
   - Ejecución
   - Microservicio Email
5. [Estructura de directorios](#estructura-de-directorios)
6. [Endpoints del Sistema](#endpoints-del-sistema)
   - Autenticación
   - Analíticas
   - Vehículos
   - Parqueaderos
   - Email (Simulación)

## Descripción:

APIREST para gestión de parqueaderos con autenticación y registro de usuarios, registro de vehículos y análisis de datos. Desarrollada con Express, NodeJS, Prisma y PostgreSQL.

## Características principales:

- Control de vehículos en parqueaderos de múltiples socios
- Histórico completo de vehículos parqueados (HistorialVehiculo)
- Sistema de roles (ADMIN/SOCIO) con permisos diferenciados
- Microservicio de email simulado, aplicado tanto al registro de entrada como de salidas de vehiculos

## ROLES Y PERMISOS:

### Admin puede:

- [x] CRUD completo de parqueaderos.
- [x] Asignar parqueaderos a socios.
- [x] Ver listado/detalle de vehículos en cualquier parqueadero.
- [x] Simular envío de emails a socios.
- [x] Acceder a todos los indicadores.

### Socio puede:

- [x] Registrar entrada/salida de vehículos en sus parqueaderos.
- [x] Ver sus parqueaderos asociados.
- [x] Ver vehículos en sus parqueaderos.
- [x] Acceder a indicadores de sus parqueaderos.
