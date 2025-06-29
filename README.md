# 🚌 SOA-BUS Service Bus (API Gateway)

Un **Service Bus** moderno basado en Node.js, TypeScript y Express, que actúa como gateway y orquestador de servicios en una arquitectura SOA (Service-Oriented Architecture).

## 📋 Tabla de Contenidos
- [Características](#características)
- [Arquitectura](#arquitectura)
- [Tecnologías](#tecnologías)
- [Instalación](#instalación)
- [Variables de Entorno](#variables-de-entorno)
- [Rutas y Servicios](#rutas-y-servicios)
- [Flows API](#flows-api)
- [Seguridad](#seguridad)
- [Despliegue](#despliegue)
- [Swagger / OpenAPI](#swagger--openapi)

---

## ✨ Características
- 🔐 Autenticación JWT centralizada
- 🏗️ Arquitectura SOA desacoplada
- 🔄 Proxy inteligente a microservicios
- 🛡️ Middleware de seguridad y partners
- 📊 Base de datos MySQL (TypeORM)
- 📝 Documentación Swagger/OpenAPI
- 🚀 Despliegue con PM2
- 🔄 **Orquestación de flujos complejos**

---

## 🏗️ Arquitectura

```
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Frontend    │    │  Mobile App  │    │  Partner API │
└──────┬───────┘    └──────┬───────┘    └──────┬───────┘
       │                   │                   │
       └─────────────┬─────┴─────┬─────────────┘
                     │           │
           ┌─────────▼───────────▼───────────┐
           │      SOA-BUS Service Bus        │
           │   (API Gateway, puerto 2222)    │
           │  ┌─────────────────────────────┐ │
           │  │      Flows Orchestration    │ │
           │  │   • Create Sale Flow        │ │
           │  │   • Login Flow              │ │
           │  └─────────────────────────────┘ │
           └─────────┬───────────┬───────────┘
                     │           │
      ┌──────────────┼───────────┼──────────────┐
      │              │           │              │
┌─────▼─────┐ ┌──────▼─────┐ ┌───▼─────┐ ┌─────▼─────┐
│UserSvc(2221)│EventSvc(2223)│TicketSvc│SaleSvc(2225)│
└────────────┘ └─────────────┘ └────────┘ └───────────┘
```

---

## 🛠️ Tecnologías
- Node.js, TypeScript, Express
- TypeORM, MySQL
- JWT, bcrypt
- express-http-proxy, axios
- PM2, dotenv
- Swagger/OpenAPI

---

## 🚀 Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <repo-url>
   cd SOA-BUS
   ```
2. **Instala dependencias:**
   ```bash
   npm install
   ```
3. **Configura el archivo `.env`:**
   ```env
   PORT=2222
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=tu_password
   DB_NAME=SOA
   JWT_SECRET=tu_jwt_secret
   USER_SERVICE_URL=http://localhost:2221/api
   EVENT_SERVICE_URL=http://localhost:2223/api
   TICKET_SERVICE_URL=http://localhost:2225/api
   SALE_SERVICE_URL=http://localhost:2225/api
   PARTNER_SERVICE_URL=http://localhost:2224/api
   SWAGGER_SERVER_URL=http://localhost:2222/api
   ```
4. **Ejecuta el gateway:**
   ```bash
   npm run dev
   # o para producción
   npm run build && npm start
   ```

---

## 🔌 Rutas y Servicios

| Ruta Base         | Servicio Asociado         | Variable de entorno         |
|-------------------|--------------------------|-----------------------------|
| `/api/auth`       | Autenticación            | -                           |
| `/api/users`      | User Service             | USER_SERVICE_URL            |
| `/api/events`     | Event Service            | EVENT_SERVICE_URL           |
| `/api/tickets`    | Ticket Service           | TICKET_SERVICE_URL          |
| `/api/sales`      | Sale Service             | SALE_SERVICE_URL            |
| `/api/partners`   | Partner Service          | PARTNER_SERVICE_URL         |
| `/api/flows`      | **Flows Orchestration**  | -                           |
| `/api/test`       | Test JWT (interna)       | -                           |

**Todas las rutas usan variables de entorno para desacoplar la configuración.**

---

## 🔄 Flows API

Los **Flows** son endpoints que orquestan múltiples servicios para completar procesos complejos de negocio:

### Create Sale Flow (`POST /api/flows/create-sale`)

Orquesta el proceso completo de creación de venta:

1. **Validación de entrada** - Valida los datos de la venta
2. **Verificación de disponibilidad** - Consulta al Event Service
3. **Validación de partner** - Verifica el token del partner
4. **Generación de tickets** - Crea tickets en el Ticket Service
5. **Creación de venta** - Registra la venta en el Sale Service

**Ejemplo de uso:**
```bash
curl -X POST http://localhost:2222/api/flows/create-sale \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "eventLocationId": 5,
    "quantity": 2,
    "partnerToken": "7a2a63cef3e1b4f181fa23b212303b2f",
    "cardHash": "hash_tarjeta_abc123"
  }'
```

**Respuesta exitosa:**
```json
{
  "message": "Venta creada exitosamente",
  "data": {
    "id": 123,
    "userId": 1,
    "totalAmount": 100.00,
    "status": "completed",
    "createdAt": "2024-01-15T10:30:00Z",
    "saleDetails": [
      {
        "ticketId": 456,
        "amount": 50.00
      },
      {
        "ticketId": 457,
        "amount": 50.00
      }
    ]
  }
}
```

### Direct Sale Creation (`POST /api/sales/create`)

Crea una venta directamente con datos pre-validados:

**Ejemplo de uso:**
```bash
curl -X POST http://localhost:2222/api/sales/create \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "userId": 1,
    "partnerId": 3,
    "totalAmount": 100.00,
    "saleDetails": [
      {
        "ticketId": 1,
        "amount": 25.50
      },
      {
        "ticketId": 2,
        "amount": 74.50
      }
    ]
  }'
```

### Login Flow (`POST /api/auth/login`)

Proceso de autenticación que:
1. Valida credenciales con el User Service
2. Genera token JWT
3. Retorna información segura del usuario

---

## 📋 DTOs (Data Transfer Objects)

Los DTOs definen la estructura de datos para las operaciones de la API:

### CreateSaleFlowDto
Usado para orquestación de ventas:
```typescript
{
  partnerToken: string;     // Token del partner
  userId: number;           // ID del usuario
  quantity: number;         // Cantidad de tickets
  eventLocationId: number;  // ID de ubicación del evento
  cardHash: string;         // Hash de la tarjeta
}
```

### CreateSaleDto
Usado para creación directa de ventas:
```typescript
{
  userId: number;           // ID del usuario
  partnerId: number;        // ID del partner
  totalAmount: number;      // Monto total
  saleDetails: SaleDetail[]; // Detalles de la venta
}
```

### SaleDetailDto
Detalle individual de una venta:
```typescript
{
  ticketId: number;         // ID del ticket
  amount: number;           // Monto del ticket
}
```

### PartnerDto
Información básica del partner:
```typescript
{
  id: number;               // ID del partner
  name: string;             // Nombre
  lastname: string;         // Apellido
}
```

---

## 🔐 Seguridad
- **JWT**: Todas las rutas protegidas requieren el header `Authorization: Bearer <token>`
- **Partner Token**: `/api/partners/token` requiere autenticación de partner
- **CORS**: Configurado para aceptar todos los orígenes por defecto

---

## 📝 Swagger / OpenAPI
- La documentación OpenAPI está disponible en `swagger.yaml` en la raíz del proyecto.
- Puedes visualizarla con [Swagger Editor](https://editor.swagger.io/) o integrarla en el gateway con Swagger UI.
- **Incluye documentación completa de los Flows API**

---

## 🧩 Ejemplo de uso

```bash
# Login
curl -X POST http://localhost:2222/api/auth/login -H "Content-Type: application/json" -d '{"email":"usuario@ejemplo.com","password":"123456"}'

# Usar el token en una ruta protegida
curl -X GET http://localhost:2222/api/test -H "Authorization: Bearer <TOKEN>"

# Crear venta con orquestación
curl -X POST http://localhost:2222/api/flows/create-sale -H "Authorization: Bearer <TOKEN>" -H "Content-Type: application/json" -d '{"userId":1,"eventLocationId":5,"quantity":2,"partnerToken":"7a2a63cef3e1b4f181fa23b212303b2f","cardHash":"hash_tarjeta_abc123"}'
```

---

## 🛠️ Scripts útiles
- `npm run dev` — Modo desarrollo
- `npm run build && npm start` — Producción
- `npm run verify:routes` — Verifica que todas las SERVICE_URL tengan rutas asociadas

---

**Desarrollado con ❤️ para arquitecturas SOA modernas** 