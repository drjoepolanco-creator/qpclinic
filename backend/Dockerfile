FROM node:18-alpine

WORKDIR /app

# dependencias
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copiar TODA la carpeta src y migraciones
COPY backend/src ./src
COPY backend/migrations ./migrations

EXPOSE 3000
CMD ["node","src/index.js"]
