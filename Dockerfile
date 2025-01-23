# --- Etapa 1: Construcción ---
FROM node:18-alpine AS build

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package.json ./

# Eliminar node_modules para evitar errores previos
RUN rm -rf node_modules

# Instalar dependencias y forzar la compilación de `better-sqlite3`
RUN npm install

# Copiar el código fuente
COPY . .

# --- Etapa 2: Runtime ---
FROM node:18-alpine

# Instalar SQLite en la imagen final
RUN apk add --no-cache sqlite sqlite-dev

# Configurar el directorio de trabajo
WORKDIR /app

# Copiar dependencias compiladas desde la etapa de build
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app .

# Exponer el puerto de la aplicación
EXPOSE 3000

# Definir la variable de entorno
ENV NODE_ENV=production

# Ejecutar la aplicación
CMD ["node", "server.js"]