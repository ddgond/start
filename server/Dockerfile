# Base stage – sets up Node + pnpm
FROM node:24-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@10 --activate

# Dependencies – install once, cache layers
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --prod=false

# Build – compile TS, generate Prisma client
FROM deps AS build
COPY tsconfig.json ./
COPY prisma ./prisma
COPY src ./src
# dummy URL so `prisma generate` runs without a live DB
ARG PRISMA_DUMMY_DB_URL="postgresql://user:pass@localhost:5432/db"
ENV DATABASE_URL=$PRISMA_DUMMY_DB_URL
RUN pnpm prisma generate
RUN pnpm run build

# Production image – tiny, runtime-only deps
FROM base AS prod
ENV NODE_ENV=production
WORKDIR /app

# Copy prod-only deps
COPY --from=deps /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=deps /app/package.json ./package.json
RUN pnpm install --frozen-lockfile --prod

# Copy compiled output and Prisma artifacts
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
RUN pnpm prisma generate
EXPOSE 3000

# Run one-shot migrations, then start API
CMD ["sh", "-c", "pnpm prisma migrate deploy && node dist/main.js"]

# Development - copy sources and run dev server
FROM deps AS dev
WORKDIR /app

# copy sources
COPY prisma ./prisma
COPY src ./src
RUN pnpm prisma generate

ENV NODE_ENV=development
CMD ["pnpm", "dev"]
