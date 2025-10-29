# QP Clinic — Monorepo (Backend v1.2 + Frontend v6.2)

Este repo está listo para desplegar **API + Postgres en Render** y **Frontend en Netlify**.
Si prefieres, también puedes desplegar TODO en Render (static site + web service).

## Estructura
```
/backend     -> API Node/Express v1.2 (PDF, roles, firma, bloqueo 24h)
/frontend    -> Frontend estático (v6.2)
render.yaml  -> Blueprint de Render (DB + API)
netlify.toml -> Config de Netlify (sirve /frontend)
```

## Despliegue rápido

### 1) Sube esto a GitHub
- Crea un repo nuevo vacío en GitHub.
- Copia todo el contenido de esta carpeta y haz tu primer commit/push.

### 2) Render (DB + API)
- En Render: **New → Blueprint** y selecciona tu repo con este `render.yaml`.
- En el wizard, define variables de entorno en el servicio `api`:
  - `JWT_SECRET`: pon algo largo y único.
  - `CORS_ORIGIN`: tu URL de frontend (por ahora puede ser `*` para pruebas).
  - `SEED_DEFAULT_USERS`: `true` **solo la primera vez** (luego cámbialo a `false`).
- Render creará la DB y la API. Al finalizar, tendrás la URL de la API (p.ej. `https://tu-api.onrender.com`).

### 3) Netlify (Frontend)
- En Netlify: **Add new site → Import an existing project → GitHub**.
- Elige este repo y configura:
  - **Build command**: *(vacío)*
  - **Publish directory**: `frontend`
- Publica. Obtendrás una URL tipo `https://tu-sitio.netlify.app`.
- En el **login** del frontend, usa el botón **⚙︎ Conexión** y pega la URL de la API de Render.

### 4) Asegurar
- En Render, cambia `SEED_DEFAULT_USERS=false` y `CORS_ORIGIN=https://tu-sitio.netlify.app`, redeploy.
- Entra con `admin / qp2025!`, crea usuarios reales y **deshabilita** los de demo.

---

## Botones de despliegue (opcionales)
- **Render (Blueprint)**: tras subir a GitHub, podrás usar un enlace como:
  `https://render.com/deploy?repo=<URL_DE_TU_REPO>`
- **Netlify (Deploy Button)**: tras subir a GitHub, puedes crear un botón con:
  `https://app.netlify.com/start/deploy?repository=<URL_DE_TU_REPO>`

> Reemplaza `<URL_DE_TU_REPO>` por la URL HTTPS de tu repo en GitHub.

---

## Credenciales demo (cámbialas)
- `admin / qp2025!` (admin)
- `medico / qp2025!` (médico)
- `recepcion / qp2025!` (recep)

## Endpoints PDF
- `GET /pdf/patients/:pid/consultations/:cid` (admin/medico)
- `GET /pdf/patients/:pid/documents/:dockey` (admin/medico/recep)

¡Éxito con tu despliegue!
