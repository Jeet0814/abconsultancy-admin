# Multi-stage Dockerfile for A B Taxway Consultancy REST API
FROM node:20-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci

COPY tsconfig.json knexfile.ts ./
COPY src/ ./src/
RUN npm run build

# Production Runner
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
RUN npm ci --only=production

COPY --from=builder /app/dist ./dist
COPY knexfile.ts ./
COPY src/db/migrations ./src/db/migrations
COPY src/db/seeds ./src/db/seeds

EXPOSE 5000

CMD ["node", "dist/server.js"]
