const db = require('../config/db');

const ALLOWED = {
  buses: ['placa','marca','modelo','anio','color','combustible','tipo_bus','capacidad','numero_motor','numero_chasis','propietario_nombres','propietario_apellidos'],
  personal: [
  'tipo_documento',
  'dni',
  'nombres',
  'apellido_paterno',
  'apellido_materno',
  'apellidos',
  'telefono',
  'genero',
  'email',
  'direccion',
  'departamento',
  'provincia',
  'distrito',
  'cargo',
  'fecha_nacimiento',
  'fecha_ingreso',
  'foto_url',
  'estado'
],
  terminales: ['sede','distrito','direccion'],
  series: ['vendedor_id','terminal_id','numero_serie'],
  rutas: ['inicio','fin','nombre'],
  paradas: ['ruta_id','nombre','orden'],
  asignaciones: ['bus_id','chofer_id','copiloto_id','fecha_asignacion'],
  encomiendas: ['codigo','remitente_dni','remitente_nombres','remitente_apellidos','remitente_telefono','remitente_email','remitente_direccion','remitente_ubigeo','destinatario_dni','destinatario_nombres','destinatario_apellidos','destinatario_telefono','destinatario_email','destinatario_direccion','destinatario_ubigeo','fecha_envio','tipo_documento','origen','destino','documento_ruc','razon_social','estado','total'],
  boletos: ['codigo','pasajero_dni','pasajero_nombres','pasajero_apellidos','fecha_viaje','ruta_id','bus_id','asiento','piso','precio','estado','serie_id']
};

function tableName(req) { return req.params.resource; }
function clean(resource, body) {
  const fields = ALLOWED[resource] || [];
  return fields.filter(k => body[k] !== undefined).map(k => [k, body[k]]);
}

exports.list = async (req,res,next) => {
  try {
    const resource = tableName(req); if (!ALLOWED[resource]) return res.status(404).json({message:'Recurso no encontrado'});
    const q = String(req.query.q || '').trim();
    const limit = Math.min(Number(req.query.limit || 100), 500);
    const offset = Math.max(Number(req.query.offset || 0), 0);
    const fields = ALLOWED[resource];
    let sql = `SELECT * FROM ${resource}`; const params=[];
    if (q) { sql += ` WHERE ${fields.slice(0,8).map(f=>`CAST(${f} AS CHAR) LIKE ?`).join(' OR ')}`; fields.slice(0,8).forEach(()=>params.push(`%${q}%`)); }
    sql += ' ORDER BY id DESC LIMIT ? OFFSET ?'; params.push(limit,offset);
    const [rows] = await db.query(sql,params); res.json(rows);
  } catch(e){next(e)}
};
exports.get = async (req,res,next)=>{try{const r=tableName(req); if(!ALLOWED[r]) return res.status(404).json({message:'Recurso no encontrado'}); const [rows]=await db.query(`SELECT * FROM ${r} WHERE id=?`,[req.params.id]); if(!rows[0]) return res.status(404).json({message:'Registro no encontrado'}); res.json(rows[0]);}catch(e){next(e)}};
exports.create = async (req,res,next)=>{try{const r=tableName(req); if(!ALLOWED[r]) return res.status(404).json({message:'Recurso no encontrado'}); const pairs=clean(r,req.body); if(!pairs.length)return res.status(400).json({message:'No hay datos para guardar'}); const cols=pairs.map(x=>x[0]).join(','); const marks=pairs.map(()=>'?').join(','); const [result]=await db.query(`INSERT INTO ${r} (${cols}) VALUES (${marks})`,pairs.map(x=>x[1])); const [rows]=await db.query(`SELECT * FROM ${r} WHERE id=?`,[result.insertId]); res.status(201).json(rows[0]);}catch(e){next(e)}};
exports.update = async (req,res,next)=>{try{const r=tableName(req); if(!ALLOWED[r]) return res.status(404).json({message:'Recurso no encontrado'}); const pairs=clean(r,req.body); if(!pairs.length)return res.status(400).json({message:'No hay datos para actualizar'}); const [result]=await db.query(`UPDATE ${r} SET ${pairs.map(x=>`${x[0]}=?`).join(',')} WHERE id=?`,[...pairs.map(x=>x[1]),req.params.id]); if(!result.affectedRows)return res.status(404).json({message:'Registro no encontrado'}); const [rows]=await db.query(`SELECT * FROM ${r} WHERE id=?`,[req.params.id]); res.json(rows[0]);}catch(e){next(e)}};
exports.toggle = async (req,res,next)=>{try{const r=tableName(req); if(!ALLOWED[r])return res.status(404).json({message:'Recurso no encontrado'}); const [rows]=await db.query(`SELECT estado FROM ${r} WHERE id=?`,[req.params.id]); if(!rows[0])return res.status(404).json({message:'Registro no encontrado'}); const current=rows[0].estado; const nextState=String(current).toLowerCase()==='activo'?'Inactivo':'Activo'; await db.query(`UPDATE ${r} SET estado=? WHERE id=?`,[nextState,req.params.id]); res.json({message:'Estado actualizado',estado:nextState});}catch(e){next(e)}};
exports.remove = async (req,res,next)=>{try{const r=tableName(req); if(!ALLOWED[r])return res.status(404).json({message:'Recurso no encontrado'}); const [result]=await db.query(`DELETE FROM ${r} WHERE id=?`,[req.params.id]); if(!result.affectedRows)return res.status(404).json({message:'Registro no encontrado'}); res.json({message:'Registro eliminado'});}catch(e){next(e)}};
