# Etapa 1: Build
FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install --force

COPY . .
RUN npm run build

# Etapa 2: Producción
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

# Archivos necesarios para ejecutar Next.js en producción
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/src ./src
COPY --from=builder /app/tsconfig.json ./tsconfig.json
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/.env ./.env

EXPOSE 3038

# ✅ Usamos npm para evitar error con npx en Alpine
CMD ["npm", "start"]
