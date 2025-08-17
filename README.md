# Control de Parqueaderos APIREST

## Índice

1. [Descripción](#descripción)
2. [Características principales](#características-principales)
3. [Roles y Permisos](#roles-y-permisos)
   - Admin
   - Socio
4. [Instalación](#instalación)
   - Prerrequisitos
   - Configuración inicial
   - Configuración de entorno
   - Iniciar PostgreSQL
   - Configurar la base de datos con Prisma
   - Ejecución
   - Ejecución Microservicio Email
5. [Estructura de directorios](#estructura-de-directorios)
6. [Endpoints del Sistema](#endpoints-del-sistema)
   - Autenticación
   - Parqueaderos
   - Vehículos
   - Indicadores

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

## Instalación:

1. Prerrequisitos:

   - Node.js 18+, npm, instalados
   - PostgreSQL 14+ corriendo

2. Configuración inicial:

   - git clone [https://github.com/DIEGUS15/control_parqueaderos.git](https://github.com/DIEGUS15/control_parqueaderos.git)
   - cd control_parqueaderos
   - `npm install`

3. Configuración de entorno:
   Crear archivo `.env` en la raíz con:

   - DATABASE_URL=`postgresql://[DB_USER]:[DB_PASSWORD]@[DB_HOST]:[DB_PORT]/[DB_NAME]`
   - PORT=`4000`
   - TOKEN_SECRET=`[GENERATE_A_SECURE_SECRET_KEY]`

   Ejemplo:

   - DATABASE_URL="postgresql://postgres:Ab12345678.@localhost:5432/parqueadero"
   - TOKEN_SECRET="Some secret key"
   - PORT=4000

4. Iniciar PostgreSQL:

   - Asegúrate de que el servicio de PostgreSQL esté ejecutándose en tu sistema.
   - Crear la base de datos:
     - CREATE DATABASE parqueadero;

5. Configurar la base de datos con Prisma:
   Ejecuta los siguientes comandos en orden

   - `npm run db:generate` (Generar el cliente de Prisma)
   - `npm run db:push` (Aplicar migraciones y crear las tablas)
   - `npm run db:seed` (Ejecutar el seed para crear el usuario administrador)

   Alternativamente, puedes ejecutar todo en un solo comando:

   - `npm run db:setup`

6. Ejecución

   - `npm run dev`

7. Ejecutar microservice "email_service", abre otra terminal y escribe:
   - cd email_service
   - `npm install`
   - `npm run dev`

## Estructura de directorios:

```
control_parqueaderos/
├── email_service/                    # Microservicio de simulación de correo electrónico
│
├── prisma/                          # Configuración de base de datos
│   ├──  schema.prisma                # Schema de la base de datos con Prisma
│   └──  seed.js                      # Datos iniciales (usuario admin por defecto)
│
├── src/                             # Código fuente principal
│   │
│   ├── controllers/                 # Controladores de la API
│   │   ├──  auth.controller.js
│   │   ├──  indicadores.controller.js
│   │   ├──  parqueadero.controller.js
│   │   └──  vehiculo.controller.js
│   │
│   ├── dto/                         # Data Transfer Objects
│   │   ├──  auth.dto.js
│   │   ├──  indicadores.dto.js
│   │   ├──  parqueadero.dto.js
│   │   └──  vehiculo.dto.js
│   │
│   ├── entities/                    # Entidades del dominio
│   │   ├──  historialVehiculo.js
│   │   ├──  parqueadero.js
│   │   ├──  registroVehiculo.js
│   │   ├──  user.js
│   │   │
│   │   └── valueObjects/            # Objetos de valor
│   │       ├──  dateRange.js
│   │       └──  vehiculoFrequency.js
│   │
│   ├── exceptions/                  # Excepciones personalizadas
│   │   ├──  authExceptions.js
│   │   ├──  indicadoresExceptions.js
│   │   ├──  parqueaderoExceptions.js
│   │   └──  vehiculoExceptions.js
│   │
│   ├── libs/                        # Librerías y utilidades
│   │   └──  jwt.js
│   │
│   ├── middlewares/                 # Middlewares de Express
│   │   ├──  checkRole.js
│   │   ├──  errorHandler.js
│   │   ├──  validateToken.js
│   │   └──  validator.middleware.js
│   │
│   ├── repository/                  # Capa de acceso a datos
│   │   ├──  indicadoresRepository.js
│   │   ├──  parqueaderoRepository.js
│   │   ├──  userRepository.js
│   │   └──  vehiculoRepository.js
│   │
│   ├── routes/                      # Definición de rutas
│   │   ├──  auth.routes.js
│   │   ├──  indicadores.routes.js
│   │   ├──  parqueadero.routes.js
│   │   └──  vehiculo.routes.js
│   │
│   ├── schemas/                     # Esquemas de validación
│   │   ├──  auth.schema.js
│   │   ├──  parqueadero.schema.js
│   │   └──  vehiculo.schema.js
│   │
│   ├── services/                    # Lógica de negocio
│   │   ├──  authService.js
│   │   ├──  emailService.js
│   │   ├──  indicadoresService.js
│   │   ├──  parqueaderoService.js
│   │   └──  vehiculoService.js
│   │
│   ├── app.js                       # Configuración de Express
│   ├── config.js                    # Variables de configuración
│   ├── db.js                        # Configuración de Prisma
│   └── index.js                     # Punto de entrada de la aplicación
│
├── .gitignore                       # Archivos ignorados por Git
├── package.json                     # Dependencias y scripts del proyecto
└── README.md                        # Documentación del proyecto
```

## ENDPOINTS DEL SISTEMA

Descarga la colección desde [postman_collection.json](postman/Control-Parqueadero.postman_collection.json).

## RUTA BASE:

- http://localhost:4000/api

## 🔐 AUTENTICACIÓN

### Login

```http
POST /login
Descripción: Iniciar sesión en el sistema
Body: {
  "email": "admin@mail.com",
  "password": "admin"
}
Permisos: Público
```

### Register

```http
POST /register
Descripción: Registrar un nuevo usuario (socio)
Cookies: token={jwt_token}
Body: {
  "fullname": "Juan Camilo Banguero Fonseca",
  "email": "bame@gmail.com",
  "password": "Ab12345678."
}
Permisos: admin
```

### Logout

```http
POST /logout
Descripción: Cerrar sesión actual
Cookies: token={jwt_token}
Permisos: Usuario autenticado
```

---

## 🅿️ PARQUEADEROS

### Crear Parqueadero

```http
POST /parqueadero
Descripción: Crear un nuevo parqueadero
Cookies: token={jwt_token}
Body: {
  "nombre": "Nueva Floresta",
  "direccion": "Calle 31A #3E-108 La Cordialidad, Los Patios",
  "capacidad": 26,
  "costoPorHora": 2687.25,
  "socioId": 4
}
Permisos: Admin
```

### Listar Parqueaderos

```http
GET /parqueadero
Descripción: Obtener lista de todos los parqueaderos
Cookies: token={jwt_token}
Permisos: Admin
```

### Obtener Parqueadero por ID

```http
GET /parqueadero/{id}
Descripción: Obtener detalles de un parqueadero específico
Cookies: token={jwt_token}
Ejemplo: GET /parqueadero/2
Permisos: Admin
```

### Actualizar Parqueadero

```http
PUT /parqueadero/{id}
Descripción: Actualizar información de un parqueadero
Cookies: token={jwt_token}
Body: {
  "nombre": "Barco tres",
  "direccion": "Calle 31A #3E-108 La Cordialidad, Los Patios",
  "capacidad": 20,
  "costoPorHora": 5700,
  "socioId": 3,
  "activo": true
}
Ejemplo: PUT /parqueadero/3
Permisos: Admin
```

### Alternar Estado del Parqueadero

```http
PATCH /parqueadero/{id}/toggle
Descripción: Activar/desactivar un parqueadero
Cookies: token={jwt_token}
Ejemplo: PATCH /parqueadero/1/toggle
Permisos: Admin
```

### Estadísticas de Parqueaderos

```http
GET /parqueadero/stats
Descripción: Obtener estadísticas generales de parqueaderos
Cookies: token={jwt_token}
Permisos: Admin
```

### Parqueaderos por Socio

```http
GET /parqueadero/socio/{socioId}
Descripción: Obtener parqueaderos asociados a un socio específico
Cookies: token={jwt_token}
Ejemplo: GET /parqueadero/socio/2
Permisos: Admin
```

### Eliminar parqueadero

```http
DELETE /parqueadero/{id}
Descripción: Eliminar un parqueadero específico
Cookies: token={jwt_token}
Ejemplo: DELETE /parqueadero/3
Permisos: Admin
```

## Obtener mis parqueaderos siendo un socio logueado

```http
GET /parqueadero/mis-parqueaderos
Descripción: Obtener todos los parqueaderos del socio autenticado
Cookies: token={jwt_token}
Permisos: Socio
```

---

## 🚗 VEHÍCULOS

### Registrar Entrada de Vehículo

```http
POST /vehiculo/ingreso
Descripción: Registrar la entrada de un vehículo al parqueadero
Cookies: token={jwt_token}
Body: {
  "placa": "HFE456",
  "parqueaderoId": 2
}
Permisos: Socio
```

### Registrar Salida de Vehículo

```http
POST /vehiculo/salida
Descripción: Registrar la salida de un vehículo del parqueadero
Cookies: token={jwt_token}
Body: {
  "placa": "ABC123",
  "parqueaderoId": 1
}
Permisos: Socio
```

### Vehículos en Parqueadero (Admin)

```http
GET /vehiculo/parqueadero/{parqueaderoId}
Descripción: Listar vehículos actualmente en un parqueadero específico
Cookies: token={jwt_token}
Ejemplo: GET /vehiculo/parqueadero/1
Permisos: Admin
```

### Vehículos en Parqueadero (Socio)

```http
GET /vehiculo/socio/parqueadero/{parqueaderoId}
Descripción: Listar vehículos en parqueadero propio del socio
Cookies: token={jwt_token}
Ejemplo: GET /vehiculo/socio/parqueadero/2
Permisos: Socio propietario
```

---

## 📊 INDICADORES / ANALYTICS

### Top Vehículos (Global)

```http
GET /indicadores/top-vehiculos
Descripción: Top vehículos más registrados en todos los parqueaderos
Cookies: token={jwt_token}
Permisos: Admin/Socio
```

### Top Vehículos por Parqueadero

```http
GET /indicadores/top-vehiculos/{parqueaderoId}
Descripción: Top vehículos más registrados en un parqueadero específico
Cookies: token={jwt_token}
Ejemplo: GET /indicadores/top-vehiculos/1
Permisos: Admin/Socio propietario
```

### Buscar Vehículos (Global)

```http
GET /indicadores/buscar?busqueda={query}
Descripción: Buscar vehículos por placa en todos los parqueaderos
Cookies: token={jwt_token}
Query Parameters:
  - busqueda: string (parte de la placa a buscar)
Ejemplo: GET /indicadores/buscar?busqueda=H
Permisos: Admin
```

### Buscar Vehículos por Parqueadero

```http
GET /indicadores/buscar/{parqueaderoId}?busqueda={query}
Descripción: Buscar vehículos por placa en un parqueadero específico
Cookies: token={jwt_token}
Query Parameters:
  - busqueda: string (parte de la placa a buscar)
Ejemplo: GET /indicadores/buscar/1?busqueda=H
Permisos: Admin/Socio propietario
```

### Ganancias por Parqueadero

```http
GET /indicadores/ganancias/{parqueaderoId}
Descripción: Obtener ganancias de un parqueadero (hoy/semana/mes/año)
Cookies: token={jwt_token}
Ejemplo: GET /indicadores/ganancias/1
Permisos: Admin/Socio propietario
```

### Vehículos Primera Vez

```http
GET /indicadores/vehiculos-primera-vez/{parqueaderoId}
Descripción: Vehículos registrados por primera vez en el parqueadero
Cookies: token={jwt_token}
Ejemplo: GET /indicadores/vehiculos-primera-vez/2
Permisos: Admin/Socio propietario
```

---

## 📝 Notas Importantes

- NOTA: El Endpoint del microservicio de simulación de envío de Email se prueba dentro del Endpoint de registrar entradas y salidas de vehiculos

- NOTA: El proyecto guarda el token en las cookies, al ejecutar el proyecto tener en cuanta hacer logout primero si se planea cambiar de rol o si se quiere probar el código sin estar logueado, esto con el fin de prevenir errores

### Autenticación

- Todos los endpoints (excepto login y register) requieren el header `Authorization: Bearer {token}`
- El token se obtiene al hacer login exitoso
- El token debe incluirse en todas las peticiones autenticadas

### Roles y Permisos

- **Admin**: Acceso completo a todos los endpoints
- **Socio**: Acceso limitado a sus propios parqueaderos y vehículos
- **Público**: Solo login

### Códigos de Estado HTTP

- `200`: Operación exitosa
- `201`: Recurso creado exitosamente
- `400`: Error en los datos enviados
- `401`: No autenticado
- `403`: Sin permisos suficientes
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

### Formato de Datos

- Todas las peticiones y respuestas usan formato JSON
- Las fechas se manejan en formato ISO 8601
- Los montos se manejan como números decimales
