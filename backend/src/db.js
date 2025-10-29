import pg from 'pg';
const { Pool } = pg;
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export async function query(text, params){ return pool.query(text, params); }
export async function tx(fn){ const c=await pool.connect(); try{ await c.query('BEGIN'); const r=await fn(c); await c.query('COMMIT'); return r; } catch(e){ await c.query('ROLLBACK'); throw e; } finally { c.release(); } }
