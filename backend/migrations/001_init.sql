-- esquema mínimo (ajústalo si ya tienes v1.1)
CREATE TABLE IF NOT EXISTS users(
  id text primary key,
  username text unique not null,
  password_hash text not null,
  role text not null default 'medico',
  name text not null,
  disabled boolean not null default false,
  created_at timestamptz not null default now()
);
CREATE TABLE IF NOT EXISTS patients(
  id text primary key,
  nombre text,
  paterno text,
  materno text,
  generales jsonb default '{}'::jsonb,
  identificacion jsonb default '{}'::jsonb,
  contacto jsonb default '{}'::jsonb,
  responsable jsonb default '{}'::jsonb,
  laborales jsonb default '{}'::jsonb,
  facturacion jsonb default '{}'::jsonb,
  antecedentes jsonb default '{}'::jsonb,
  interrogatorio jsonb default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
CREATE TABLE IF NOT EXISTS consultations(
  id text primary key,
  patient_id text not null references patients(id) on delete cascade,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  fecha timestamptz not null,
  autor_user text not null,
  autor_name text not null,
  data jsonb default '{}'::jsonb,
  signed_at timestamptz,
  signed_by text,
  signed_name text,
  fingerprint text,
  locked_at timestamptz,
  deleted boolean not null default false
);
CREATE TABLE IF NOT EXISTS addenda(
  id text primary key,
  consultation_id text not null references consultations(id) on delete cascade,
  user_id text not null,
  user_name text not null,
  text text not null,
  at timestamptz not null default now()
);
CREATE TABLE IF NOT EXISTS inter_solicitudes(
  id text primary key,
  patient_id text not null references patients(id) on delete cascade,
  fecha date not null,
  para text,
  motivo text,
  resumen text,
  preguntas text,
  remitente text,
  notas text
);
CREATE TABLE IF NOT EXISTS inter_respuestas(
  id text primary key,
  patient_id text not null references patients(id) on delete cascade,
  fecha date not null,
  interconsultante text,
  conclusiones text,
  recomendaciones text,
  notas text
);
CREATE TABLE IF NOT EXISTS documents(
  id text primary key,
  patient_id text not null references patients(id) on delete cascade,
  dockey text not null,
  texto text,
  firmado_por text,
  firma text,
  fecha text
);
