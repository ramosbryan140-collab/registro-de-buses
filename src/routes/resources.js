const express = require("express");
const c = require("../controllers/crud");

const router = express.Router();

/*
|--------------------------------------------------------------------------
| Recursos disponibles
|--------------------------------------------------------------------------
*/

const resources = [
  "buses",
  "personal",
  "terminales",
  "series",
  "rutas",
  "paradas",
  "asignaciones",
  "encomiendas",
  "boletos",
];

/*
|--------------------------------------------------------------------------
| Validación del recurso
|--------------------------------------------------------------------------
*/

function validarRecurso(req, res, next) {
  const resource = req.params.resource;

  if (!resources.includes(resource)) {
    return res.status(404).json({
      message: "Recurso no encontrado",
      resource,
    });
  }

  next();
}

/*
|--------------------------------------------------------------------------
| CRUD genérico
|--------------------------------------------------------------------------
*/

/*
GET /api/personal
GET /api/buses
GET /api/terminales
...
*/
router.get(
  "/:resource",
  validarRecurso,
  c.list
);

/*
GET /api/personal/1
GET /api/buses/1
...
*/
router.get(
  "/:resource/:id",
  validarRecurso,
  c.get
);

/*
POST /api/personal
POST /api/buses
...
*/
router.post(
  "/:resource",
  validarRecurso,
  c.create
);

/*
PUT /api/personal/1
PUT /api/buses/1
...
*/
router.put(
  "/:resource/:id",
  validarRecurso,
  c.update
);

/*
PATCH /api/personal/1
PATCH /api/buses/1
...
*/
router.patch(
  "/:resource/:id",
  validarRecurso,
  c.update
);

/*
PATCH /api/personal/1/estado
PATCH /api/buses/1/estado
...
*/
router.patch(
  "/:resource/:id/estado",
  validarRecurso,
  c.toggle
);

/*
DELETE /api/personal/1
DELETE /api/buses/1
...
*/
router.delete(
  "/:resource/:id",
  validarRecurso,
  c.remove
);

module.exports = router;