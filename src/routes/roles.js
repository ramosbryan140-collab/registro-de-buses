const express = require('express');
const db = require('../config/db');

const router = express.Router();

/**
 * ============================================================
 * OBTENER TODOS LOS ROLES
 * GET /api/roles
 * ============================================================
 */
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT
        id,
        nombre
      FROM roles
      ORDER BY nombre ASC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

/**
 * ============================================================
 * OBTENER PERSONAL CON SU USUARIO Y ROL
 * GET /api/roles/personal
 *
 * IMPORTANTE:
 * NO devuelve password_hash.
 * ============================================================
 */
router.get('/personal', async (req, res, next) => {
  try {
    const [rows] = await db.query(`
      SELECT
        p.id AS personal_id,
        p.tipo_documento,
        p.dni,
        p.nombres,
        p.apellido_paterno,
        p.apellido_materno,
        p.apellidos,
        p.cargo,
        p.email,
        p.telefono,
        p.estado AS personal_estado,

        u.id AS usuario_id,
        u.usuario,
        u.activo AS usuario_activo,

        r.id AS rol_id,
        r.nombre AS rol_nombre

      FROM personal p

      LEFT JOIN usuarios u
        ON u.personal_id = p.id

      LEFT JOIN roles r
        ON r.id = u.rol_id

      ORDER BY p.nombres ASC, p.apellido_paterno ASC
    `);

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

/**
 * ============================================================
 * ASIGNAR / CAMBIAR ROL DE UN USUARIO
 *
 * PUT /api/roles/usuario/:usuarioId
 *
 * Body:
 * {
 *   "rol_id": 2
 * }
 * ============================================================
 */
router.put('/usuario/:usuarioId', async (req, res, next) => {
  try {
    const usuarioId = Number(req.params.usuarioId);
    const { rol_id } = req.body;

    if (!usuarioId) {
      return res.status(400).json({
        message: 'ID de usuario inválido'
      });
    }

    if (!rol_id) {
      return res.status(400).json({
        message: 'Debe seleccionar un rol'
      });
    }

    // Verificar que el rol exista
    const [roles] = await db.query(
      `
      SELECT id, nombre
      FROM roles
      WHERE id = ?
      `,
      [rol_id]
    );

    if (!roles.length) {
      return res.status(404).json({
        message: 'El rol seleccionado no existe'
      });
    }

    // Verificar que el usuario exista
    const [usuarios] = await db.query(
      `
      SELECT
        id,
        usuario,
        personal_id
      FROM usuarios
      WHERE id = ?
      `,
      [usuarioId]
    );

    if (!usuarios.length) {
      return res.status(404).json({
        message: 'El usuario no existe'
      });
    }

    await db.query(
      `
      UPDATE usuarios
      SET rol_id = ?
      WHERE id = ?
      `,
      [rol_id, usuarioId]
    );

    // Devolver información actualizada
    const [rows] = await db.query(
      `
      SELECT
        u.id AS usuario_id,
        u.usuario,
        u.personal_id,
        r.id AS rol_id,
        r.nombre AS rol_nombre
      FROM usuarios u
      LEFT JOIN roles r
        ON r.id = u.rol_id
      WHERE u.id = ?
      `,
      [usuarioId]
    );

    res.json({
      message: 'Rol asignado correctamente',
      usuario: rows[0]
    });

  } catch (error) {
    next(error);
  }
});

/**
 * ============================================================
 * CREAR UN NUEVO ROL
 *
 * POST /api/roles
 *
 * Body:
 * {
 *   "nombre": "Supervisor"
 * }
 * ============================================================
 */
router.post('/', async (req, res, next) => {
  try {
    const nombre = String(req.body.nombre || '').trim();

    if (!nombre) {
      return res.status(400).json({
        message: 'El nombre del rol es obligatorio'
      });
    }

    const [existente] = await db.query(
      `
      SELECT id
      FROM roles
      WHERE LOWER(nombre) = LOWER(?)
      `,
      [nombre]
    );

    if (existente.length) {
      return res.status(409).json({
        message: 'El rol ya existe'
      });
    }

    const [result] = await db.query(
      `
      INSERT INTO roles (nombre)
      VALUES (?)
      `,
      [nombre]
    );

    const [rows] = await db.query(
      `
      SELECT id, nombre
      FROM roles
      WHERE id = ?
      `,
      [result.insertId]
    );

    res.status(201).json(rows[0]);

  } catch (error) {
    next(error);
  }
});

/**
 * ============================================================
 * ACTUALIZAR NOMBRE DE ROL
 *
 * PUT /api/roles/:id
 * ============================================================
 */
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const nombre = String(req.body.nombre || '').trim();

    if (!id) {
      return res.status(400).json({
        message: 'ID de rol inválido'
      });
    }

    if (!nombre) {
      return res.status(400).json({
        message: 'El nombre del rol es obligatorio'
      });
    }

    const [result] = await db.query(
      `
      UPDATE roles
      SET nombre = ?
      WHERE id = ?
      `,
      [nombre, id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        message: 'Rol no encontrado'
      });
    }

    const [rows] = await db.query(
      `
      SELECT id, nombre
      FROM roles
      WHERE id = ?
      `,
      [id]
    );

    res.json(rows[0]);

  } catch (error) {
    next(error);
  }
});

/**
 * ============================================================
 * ELIMINAR ROL
 *
 * DELETE /api/roles/:id
 * ============================================================
 */
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!id) {
      return res.status(400).json({
        message: 'ID de rol inválido'
      });
    }

    // Verificar si algún usuario utiliza el rol
    const [usuarios] = await db.query(
      `
      SELECT COUNT(*) AS cantidad
      FROM usuarios
      WHERE rol_id = ?
      `,
      [id]
    );

    if (usuarios[0].cantidad > 0) {
      return res.status(409).json({
        message:
          'No se puede eliminar este rol porque está asignado a uno o más usuarios'
      });
    }

    const [result] = await db.query(
      `
      DELETE FROM roles
      WHERE id = ?
      `,
      [id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({
        message: 'Rol no encontrado'
      });
    }

    res.json({
      message: 'Rol eliminado correctamente'
    });

  } catch (error) {
    next(error);
  }
});

module.exports = router;