# ==========================================
# 1. BASE STAGE
# ==========================================

FROM node:22-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile --ignore-scripts


# ==========================================
# 2. DEVELOPMENT STAGE
# ==========================================

FROM base AS development

COPY . .

EXPOSE 5174

CMD ["pnpm", "dev", "--host", "0.0.0.0", "--port", "5174"]


# ==========================================
# 3. BUILDER STAGE
# ==========================================

FROM base AS builder

COPY . .

RUN pnpm build


# ==========================================
# 4. PRODUCTION STAGE
# ==========================================

FROM nginx:alpine AS production

COPY .docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]