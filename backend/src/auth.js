import jwt from 'jsonwebtoken';
import argon2 from 'argon2';
import { query } from './db.js';
import { randomId } from './util.js';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
export function signToken(payload){ return jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' }); }
export function authMiddleware(req,res,next){ const h=req.headers.authorization||''; const [s,t]=h.split(' '); if(s!=='Bearer'||!t) return res.status(401).json({error:'No token'}); try{ req.user=jwt.verify(t, JWT_SECRET); next(); }catch{ return res.status(401).json({error:'Invalid token'});} }
export async function login(username, password){ const {rows}=await query('SELECT * FROM users WHERE username=$1 AND disabled=false',[username]); if(!rows.length) return null; const u=rows[0]; const ok=await argon2.verify(u.password_hash,password); if(!ok) return null; return {id:u.id, username:u.username, role:u.role, name:u.name}; }
export async function seedDefaultUsers(){ if(process.env.SEED_DEFAULT_USERS!=='true')return; const {rows}=await query('SELECT COUNT(*)::int AS n FROM users'); if(rows[0].n>0)return; const add=async(u,p,r,n)=>{ const h=await argon2.hash(p); await query('INSERT INTO users(id,username,password_hash,role,name) VALUES ($1,$2,$3,$4,$5)',[randomId(),u,h,r,n]); }; await add('admin','qp2025!','admin','Administrador'); await add('medico','qp2025!','medico','Médico'); await add('recepcion','qp2025!','recep','Recepción'); }
