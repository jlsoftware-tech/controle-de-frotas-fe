# ==========================================
# 1. BASE STAGE (Instalação de dependências)
# ==========================================
FROM node:22-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile --ignore-scripts

# ==========================================
# 2. DEVELOPMENT STAGE (Alvo para docker-compose)
# ==========================================
FROM base AS development
COPY . .
EXPOSE 5173
CMD ["pnpm", "dev", "--host"]

# ==========================================
# 3. BUILDER STAGE (Compilação para produção)
# ==========================================
FROM base AS builder
COPY . .
RUN pnpm build

# ==========================================
# 4. PRODUCTION STAGE (Imagem final de produção)
# ==========================================
FROM nginx:alpine AS production
# Copia o arquivo Nginx isolado da pasta .docker
COPY .docker/nginx/nginx.conf /etc/nginx/conf.d/default.conf
# Copia os arquivos gerados no builder
COPY --from=builder /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
