# 🚌 SOA-BUS Service Bus

Un **Service Bus** moderno construido con Node.js, TypeScript y Express que actúa como punto de entrada centralizado y orquestador de servicios en una arquitectura SOA (Service-Oriented Architecture).

## 📋 Tabla de Contenidos

- [Características](#-características)
- [Arquitectura SOA](#-arquitectura-soa)
- [Tecnologías](#-tecnologías)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [API Endpoints](#-api-endpoints)
- [Autenticación](#-autenticación)
- [Base de Datos](#-base-de-datos)
- [Despliegue](#-despliegue)

## ✨ Características

- 🔐 **Autenticación JWT** - Sistema de autenticación seguro con tokens JWT
- 🏗️ **Arquitectura SOA** - Service Bus para orquestación de microservicios
- 🔄 **Proxy de Servicios** - Redirección inteligente y transformación de mensajes
- 🛡️ **Middleware de Seguridad** - Validación de tokens y autenticación de partners
- 📊 **Base de Datos MySQL** - Persistencia de datos con TypeORM
- 🎯 **Validación de Datos** - DTOs con class-validator
- 📝 **Documentación Swagger** - API documentada automáticamente
- 🚀 **Despliegue PM2** - Configuración para producción
- 🔌 **Integración de Servicios** - Conectividad con múltiples servicios externos

## 🏗️ Arquitectura SOA

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Mobile App    │    │   Partner API   │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────▼─────────────┐
                    │    SOA-BUS Service Bus    │
                    │   (API Gateway + ESB)     │
                    │      (Puerto 2222)        │
                    └─────────────┬─────────────┘
                                  │
          ┌───────────────────────┼───────────────────────┐
          │                       │                       │
    ┌─────▼─────┐         ┌───────▼──────┐        ┌──────▼─────┐
    │ User      │         │ Partner      │        │ Event      │
    │ Service   │         │ Service      │        │ Service    │
    │ (2221)    │         │ (2223)       │        │ (2224)     │
    └───────────┘         └──────────────┘        └────────────┘
```

### 🎯 **Funciones del Service Bus:**

- **Orquestación de Servicios** - Coordina la comunicación entre servicios
- **Transformación de Mensajes** - Convierte formatos entre servicios
- **Enrutamiento Inteligente** - Dirige requests al servicio correcto
- **Autenticación Centralizada** - Gestiona tokens y permisos
- **Logging y Monitoreo** - Registra todas las transacciones
- **Rate Limiting** - Controla el flujo de requests
- **Caché** - Optimiza el rendimiento

## 🛠️ Tecnologías

- **Node.js** - Runtime de JavaScript
- **TypeScript** - Lenguaje de programación tipado
- **Express.js** - Framework web para el Service Bus
- **TypeORM** - ORM para base de datos
- **MySQL** - Base de datos relacional
- **JWT** - JSON Web Tokens para autenticación
- **bcrypt** - Encriptación de contraseñas
- **PM2** - Gestor de procesos para producción
- **Axios** - Cliente HTTP para comunicación entre servicios
- **express-http-proxy** - Proxy para redirección de servicios

## 🚀 Instalación

### Prerrequisitos

- Node.js (v16 o superior)
- MySQL (v8.0 o superior)
- npm o yarn

### Pasos de Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd SOA-BUS
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   # Opción 1: Usar el script interactivo
   npm run setup
   
   # Opción 2: Copiar el archivo de ejemplo
   cp env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Configurar la base de datos**
   ```sql
   CREATE DATABASE SOA;
   ```

5. **Ejecutar el Service Bus**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm run build
   npm start
   ```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# SERVER CONFIGURATION
NODE_ENV=development
PORT=2222

# DATABASE CONFIGURATION (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=your_password
DB_NAME=SOA

# JWT CONFIGURATION
JWT_SECRET=your_super_secret_jwt_key_here

# EXTERNAL SERVICES (Service Endpoints)
PARTNER_URL_SERVICE=http://localhost:2223
PARTNER_SERVICE_URL=http://localhost:2223
EVENT_SERVICE_URL=http://localhost:2224

# CORS CONFIGURATION
CORS_ORIGIN=*

# LOGGING CONFIGURATION
LOG_LEVEL=debug

# SECURITY CONFIGURATION
BCRYPT_SALT_ROUNDS=10
```

### Scripts Disponibles

```bash
# Desarrollo
npm run dev              # Ejecutar Service Bus en modo desarrollo con hot reload
npm run build            # Compilar TypeScript
npm run start            # Ejecutar Service Bus en modo producción

# Configuración
npm run setup            # Configuración interactiva de variables de entorno
npm run setup:dev        # Crear archivo .env básico para desarrollo
npm run validate:env     # Validar configuración de variables de entorno

# PM2 (Producción)
npm run pm2:start        # Iniciar Service Bus con PM2
npm run pm2:start:dev    # Iniciar en modo desarrollo con PM2
npm run pm2:stop         # Detener Service Bus
npm run pm2:restart      # Reiniciar Service Bus
npm run pm2:delete       # Eliminar Service Bus de PM2

# Testing
npm test                 # Ejecutar tests
```

## 🔌 API Endpoints

### Autenticación (`/api/auth`)

#### POST `/api/auth/login`
Autentica un usuario y devuelve un token JWT para acceder a los servicios.

**Request Body:**
```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "data": {
    "id": 1,
    "name": "Juan",
    "lastname": "Pérez",
    "email": "usuario@ejemplo.com",
    "isActive": true,
    "rol": {
      "id": 1,
      "name": "admin"
    }
  }
}
```

### Usuarios (`/api/users`)
*Protegido con JWT*

Proxy hacia el servicio de usuarios en el puerto 2221. El Service Bus redirige todas las requests a este endpoint.

### Eventos (`/api/events`)

#### GET `/api/events/event-locations/paginated`
*Requiere autenticación de partner*

Obtiene ubicaciones de eventos paginadas desde el servicio de eventos.

**Headers:**
```
Authorization: Bearer <partner_token>
```

**Query Parameters:**
- `page`: Número de página (default: 1)
- `limit`: Elementos por página (default: 10)

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Evento 1",
      "location": "Ubicación 1",
      "date": "2024-01-15T10:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10
  }
}
```

## 🔐 Autenticación

### JWT Authentication

El Service Bus utiliza JWT (JSON Web Tokens) para la autenticación de usuarios.

**Flujo de Autenticación:**
1. El usuario envía credenciales a `/api/auth/login`
2. El Service Bus valida las credenciales contra la base de datos
3. Si son válidas, se genera un token JWT
4. El token se devuelve al cliente
5. El cliente incluye el token en el header `Authorization: Bearer <token>`
6. El Service Bus valida el token en cada request a servicios protegidos

**Middleware de Autenticación:**
- `authJwt.ts` - Valida tokens JWT para rutas protegidas
- `authPartnerToken.ts` - Valida tokens de partners para servicios externos

### Partner Authentication

Para servicios externos, se utiliza un sistema de autenticación de partners:

```typescript
// Ejemplo de uso en el Service Bus
const response = await axios.get(
  `${process.env.PARTNER_SERVICE_URL}/partners/token/${token}`
);
```

## 🗄️ Base de Datos

### Esquema de Base de Datos

El Service Bus mantiene su propia base de datos para autenticación y gestión de usuarios.

#### Tabla: `tbl_users`
```sql
CREATE TABLE tbl_users (
  user_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  lastname VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  rol_id INT NOT NULL,
  deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (rol_id) REFERENCES tbl_roles(rol_id)
);
```

#### Tabla: `tbl_roles`
```sql
CREATE TABLE tbl_roles (
  rol_id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  deleted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🚀 Despliegue

### Desarrollo Local

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
npm run setup

# Ejecutar Service Bus en modo desarrollo
npm run dev
```

### Producción con PM2

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Iniciar Service Bus
npm run pm2:start

# Ver logs
pm2 logs

# Monitorear
pm2 monit
```

### Variables de Entorno de Producción

```env
NODE_ENV=production
PORT=2222
DB_HOST=your-production-db-host
DB_USERNAME=your-production-db-user
DB_PASSWORD=your-production-db-password
DB_NAME=soa_bus_production
JWT_SECRET=your-super-secure-production-jwt-secret
PARTNER_SERVICE_URL=https://your-partner-service.com
EVENT_SERVICE_URL=https://your-event-service.com
```

## 📁 Estructura del Proyecto

```
SOA-BUS/
├── src/
│   ├── config/
│   │   └── environment.ts      # Configuración centralizada del Service Bus
│   ├── infrastructure/
│   │   ├── controller/
│   │   │   └── login.controller.ts    # Controlador de autenticación
│   │   ├── database/
│   │   │   └── database.ts            # Configuración de TypeORM
│   │   ├── dto/
│   │   │   └── users.dto.ts           # Data Transfer Objects
│   │   ├── entity/
│   │   │   ├── roles.entity.ts        # Entidad de roles
│   │   │   └── users.entity.ts        # Entidad de usuarios
│   │   ├── middleware/
│   │   │   ├── authJwt.ts             # Middleware JWT
│   │   │   └── authPartnerToken.ts    # Middleware de partners
│   │   └── routes/
│   │       ├── auth.routes.ts         # Rutas de autenticación
│   │       ├── events.routes.ts       # Rutas de eventos (proxy)
│   │       └── user.routes.ts         # Rutas de usuarios (proxy)
│   ├── model/
│   │   ├── message.model.ts           # Modelos de mensajes
│   │   └── room.model.ts              # Modelos de salas
│   ├── repository/
│   │   ├── base-repository.interface.ts
│   │   ├── roles.repository.ts        # Repositorio de roles
│   │   └── users.repository.ts        # Repositorio de usuarios
│   ├── service/
│   │   ├── ISocketService.ts          # Interfaz de servicio de sockets
│   │   ├── roles.service.ts           # Servicio de roles
│   │   ├── socket.service.ts          # Servicio de sockets
│   │   └── user.service.ts            # Servicio de usuarios
│   ├── utils/
│   │   ├── bcrip.util.ts              # Utilidades de encriptación
│   │   └── getPaginated.ts            # Utilidades de paginación
│   └── server.ts                      # Punto de entrada del Service Bus
├── scripts/
│   └── setup-env.js                   # Script de configuración
├── ecosystem.config.js                # Configuración PM2
└── package.json
```

## 🎯 **Beneficios del Service Bus SOA:**

- **Desacoplamiento** - Los servicios no necesitan conocerse directamente
- **Escalabilidad** - Fácil agregar nuevos servicios
- **Seguridad Centralizada** - Autenticación y autorización en un punto
- **Monitoreo** - Visibilidad completa del tráfico entre servicios
- **Transformación** - Conversión de formatos entre servicios
- **Resiliencia** - Manejo de fallos y reintentos

---

**Desarrollado con ❤️ por el equipo SOA-BUS** 