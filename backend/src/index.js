import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { query, tx } from './db.js';
import { authMiddleware, login, signToken, seedDefaultUsers } from './auth.js';
import { randomId, nowISO, isExpired24h, fingerprintNote } from './util.js';
import argon2 from 'argon2';
import PDFDocument from 'pdfkit';

const app = express();
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(cors({ origin: (o,cb)=>cb(null,true) }));

async function runMigrations(){
  await query('CREATE TABLE IF NOT EXISTS schema_migrations(id SERIAL PRIMARY KEY, name TEXT UNIQUE, applied_at TIMESTAMPTZ DEFAULT now())');
}

// AUTH
app.post('/auth/login', async (req,res)=>{
  const {username,password}=req.body||{};
  if(!username||!password) return res.status(400).json({error:'username & password required'});
  const u=await login(username,password);
  if(!u) return res.status(401).json({error:'Credenciales inválidas'});
  const token=signToken(u);
  res.json({token,user:u});
});
app.get('/auth/me', authMiddleware, (req,res)=>res.json({user:req.user}));

// USERS (admin minimal)
app.get('/users', authMiddleware, async (req,res)=>{
  const { rows } = await query('SELECT id, username, role, name, disabled, created_at FROM users ORDER BY created_at DESC');
  res.json(rows);
});

// PATIENTS minimal list/create
app.get('/patients', authMiddleware, async (req,res)=>{
  const qstr=(req.query.q||'').toLowerCase();
  const { rows } = await query('SELECT id, nombre, paterno, materno, generales, contacto FROM patients ORDER BY updated_at DESC LIMIT 500');
  res.json(rows.filter(p => (`${p.nombre||''} ${p.paterno||''} ${p.materno||''}`).toLowerCase().includes(qstr)));
});

// PDFs minimal
function sendPDF(res, filename, buildFn){
  res.setHeader('Content-Type','application/pdf');
  res.setHeader('Content-Disposition',`attachment; filename="${filename}"`);
  const doc = new PDFDocument({margin:50}); doc.pipe(res); buildFn(doc); doc.end();
}
app.get('/health', (req,res)=>res.json({ok:true}));

const PORT=process.env.PORT||3000;
runMigrations().then(seedDefaultUsers).then(()=>app.listen(PORT,()=>console.log('API v1.2.1 on :'+PORT)));
