// backend/src/index.js
import { listPatients } from './patients.js';
import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import url from 'url';
import { query } from './db.js';
import { login, signToken, seedDefaultUsers } from './auth.js';

const app = express();
app.use(helmet());
app.use(express.json({ limit: '2mb' }));
app.use(cors({ origin: (o, cb) => cb(null, true) }));

// --- Ejecutar migraciones al arrancar (lee backend/migrations/001_init.sql) ---
async function runMigrations() {
  const thisDir = path.dirname(url.fileURLToPath(import.meta.url));
  const migFile = path.join(thisDir, '..', 'migrations', '001_init.sql');
  if (!fs.existsSync(migFile)) {
    console.warn('Migration file not found:', migFile);
    return;
  }
  const sql = fs.readFileSync(migFile, 'utf8');
  // El SQL usa CREATE TABLE IF NOT EXISTS, por lo que es idempotente
  await query(sql);
  console.log('Migrations applied.');
}

// --- Rutas mínimas ---
app.get('/health', (req, res) => res.json({ ok: true }));

// Auth
app.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res.status(400).json({ error: 'username & password required' });
    }
    const u = await login(username, password);
    if (!u) return res.status(401).json({ error: 'Credenciales inválidas' });
    const token = signToken(u);
    res.json({ token, user: u });
  } catch (e) {
    console.error('login error', e);
    res.status(500).json({ error: 'Error de autenticación' });
  }
});

// Users (listado simple para verificar)
app.get('/users', async (req, res) => {
  try {
    const { rows } = await query(
      'SELECT id, username, role, name, disabled, created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch (e) {
    console.error('users error', e);
    res.status(500).json({ error: 'Error al cargar usuarios' });
  }
});

// Pacientes (dummy temporal)
app.get('/patients', async (req, res) => {
  try {
    const q = (req.query.q || '').toString();
    const rows = await listPatients(q);
    res.json(rows);
  } catch (e) {
    console.error('patients error', e);
    res.status(500).json({ error: 'Error al cargar pacientes' });
  }
});

// --- Bootstrap: migraciones, seed de usuarios y levantar servidor ---
const PORT = process.env.PORT || 3000;

(async function bootstrap() {
  try {
    await runMigrations();
    await seedDefaultUsers(); // crea admin/admin si no existe (o admin/qp2025!)
    app.listen(PORT, () => {
      console.log(`API v1.2.1 listening on :${PORT}`);
    });
  } catch (e) {
    console.error('Fatal startup error:', e);
    process.exit(1);
  }
})();

runMigrations()
  .then(seedDefaultUsers)   // crea admin/medico/recep si la tabla estaba vacía
  .then(() => app.listen(PORT, () => console.log('API v1.2.1 listening on :' + PORT)))
  .catch(err => { console.error('Startup error', err); process.exit(1); });
COPY backend/src/patients.js src/patients.js
