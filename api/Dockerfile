# API de Waby. Se construye desde la raíz del monorepo:
#   docker build -f api/Dockerfile .
# Node 22: con Node 26 jsonwebtoken no carga (AGENTS.md).

FROM node:22-slim AS base
RUN npm install -g pnpm@9.15.9
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared/package.json shared/
COPY api/package.json api/

# Build: todas las dependencias, compila shared y la API.
FROM base AS build
RUN pnpm install --frozen-lockfile --filter @waby/api...
COPY shared/ shared/
COPY api/ api/
RUN pnpm --filter @waby/shared build && pnpm --filter @waby/api build

# Solo dependencias de producción.
FROM base AS prod-deps
RUN pnpm install --frozen-lockfile --prod --filter @waby/api...

# Imagen final: Node 22, dependencias de producción y los dist de shared y la API.
FROM node:22-slim
ENV NODE_ENV=production
WORKDIR /app
COPY --from=prod-deps /app/node_modules node_modules
COPY --from=prod-deps /app/shared/node_modules shared/node_modules
COPY --from=prod-deps /app/api/node_modules api/node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/shared/package.json shared/
COPY --from=build /app/shared/dist shared/dist
COPY --from=build /app/api/package.json api/
COPY --from=build /app/api/dist api/dist
WORKDIR /app/api
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
