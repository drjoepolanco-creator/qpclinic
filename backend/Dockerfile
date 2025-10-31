# backend/Dockerfile
FROM node:18-alpine

WORKDIR /app

# 1) Instalar dependencias (no requiere package-lock)
COPY backend/package*.json ./
RUN npm install --omit=dev

# 2) Copiar código y migraciones
COPY backend/src ./src
COPY backend/migrations ./migrations

# 3) Variables básicas
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# 4) Arranque
CMD ["node", "src/index.js"]
