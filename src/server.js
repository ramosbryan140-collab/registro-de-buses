require('dotenv').config();

console.log("===== CONFIGURACIÓN MYSQL =====");
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_PORT:", process.env.DB_PORT);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_NAME:", process.env.DB_NAME);
console.log(
  "DB_PASSWORD:",
  process.env.DB_PASSWORD ? "******" : "(vacía)"
);
console.log("===============================");

const express = require('express');
const cors = require('cors');
const db = require('./config/db');
const auth = require('./middlewares/auth');

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*'
  })
);

app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

/**
 * ============================================================
 * HEALTH CHECK
 * ============================================================
 */
app.get('/api/health', async (req, res) => {
  try {
    await db.query('SELECT 1');

    res.json({
      ok: true,
      service: 'registro-buses-api',
      database: 'conectada'
    });

  } catch (e) {

    console.error('❌ ERROR DE MYSQL:', e);

    res.status(503).json({
      ok: false,
      message: 'Base de datos no disponible',
      error: e.message,
      code: e.code
    });
  }
});

/**
 * ============================================================
 * AUTENTICACIÓN
 * ============================================================
 */
app.use(
  '/api/auth',
  require('./routes/auth')
);

/**
 * ============================================================
 * MIDDLEWARE DE AUTENTICACIÓN
 * ============================================================
 */
app.use('/api', auth);

/**
 * ============================================================
 * ROLES
 *
 * IMPORTANTE:
 * Esta ruta debe estar ANTES de:
 *
 * app.use('/api', require('./routes/resources'));
 *
 * porque resources.js utiliza rutas genéricas.
 * ============================================================
 */
app.use(
  '/api/roles',
  require('./routes/roles')
);

/**
 * ============================================================
 * DASHBOARD
 *
 * También lo colocamos antes de resources.js para evitar
 * conflictos con rutas genéricas.
 * ============================================================
 */
app.use(
  '/api/dashboard',
  require('./routes/dashboard')
);

/**
 * ============================================================
 * RECURSOS GENERALES
 *
 * Buses
 * Personal
 * Terminales
 * Series
 * Rutas
 * Paradas
 * Asignaciones
 * Encomiendas
 * Boletos
 * ============================================================
 */
app.use(
  '/api',
  require('./routes/resources')
);

/**
 * ============================================================
 * MANEJO GENERAL DE ERRORES
 * ============================================================
 */
app.use((err, req, res, next) => {

  console.error(err);

  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      message: 'El registro ya existe',
      detail: err.sqlMessage
    });
  }

  res.status(500).json({
    message: 'Error interno del servidor'
  });
});

/**
 * ============================================================
 * INICIAR SERVIDOR
 * ============================================================
 */
const port = Number(process.env.PORT || 3000);

app.listen(port, () => {
  console.log(
    `API Registro de Buses ejecutándose en http://localhost:${port}`
  );
});