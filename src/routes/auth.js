const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const router = express.Router();
router.post('/login', async (req,res,next)=>{try{const {usuario,username,password,pass}=req.body; const login=usuario||username; const pwd=password||pass; if(!login||!pwd)return res.status(400).json({message:'Usuario y contraseña son obligatorios'}); const [rows]=await db.query('SELECT u.*, p.nombres, p.apellidos, r.nombre AS rol FROM usuarios u LEFT JOIN personal p ON p.id=u.personal_id LEFT JOIN roles r ON r.id=u.rol_id WHERE u.usuario=? AND u.activo=1',[login]); if(!rows[0]||!(await bcrypt.compare(pwd,rows[0].password_hash)))return res.status(401).json({message:'Credenciales incorrectas'}); const u=rows[0]; const token=jwt.sign({id:u.id,usuario:u.usuario,rol:u.rol},process.env.JWT_SECRET,{expiresIn:'8h'}); res.json({token,usuario:{id:u.id,usuario:u.usuario,nombres:u.nombres,apellidos:u.apellidos,rol:u.rol}});}catch(e){next(e)}});
module.exports=router;
