# Backend - Registro de Buses

API REST para el proyecto React `RegistrodeBuses`.

## Requisitos
- Node.js 20+
- MySQL 8+

## Instalación
1. Crear la base de datos ejecutando `database/schema.sql`.
2. Copiar `.env.example` como `.env` y configurar MySQL.
3. Ejecutar `npm install`.
4. Ejecutar `npm run dev`.

API: `http://localhost:3000/api`

Usuario inicial:
- usuario: `admin`
- contraseña: `Admin123*`

Cambiar la contraseña después de la instalación.

## Endpoints principales
- POST `/api/auth/login`
- GET/POST/PUT/PATCH/DELETE `/api/buses`
- GET/POST/PUT/PATCH/DELETE `/api/personal`
- GET/POST/PUT/PATCH/DELETE `/api/terminales`
- GET/POST/PUT/PATCH/DELETE `/api/series`
- GET/POST/PUT/PATCH/DELETE `/api/rutas`
- GET/POST/PUT/PATCH/DELETE `/api/paradas`
- GET/POST/PUT/PATCH/DELETE `/api/asignaciones`
- GET/POST/PUT/PATCH/DELETE `/api/encomiendas`
- GET/POST/PUT/DELETE `/api/boletos`
- GET `/api/dashboard`
- GET `/api/reportes/resumen`

Todas las rutas, excepto login y health, requieren `Authorization: Bearer TOKEN`.
