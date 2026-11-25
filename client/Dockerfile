# Client de Waby: build de Vite servido con nginx. Se construye desde la raíz del monorepo:
#   docker build -f client/Dockerfile --build-arg VITE_API_URL=http://localhost:3000/api/v1/ .

FROM node:22-slim AS build
RUN npm install -g pnpm@9.15.9
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY shared/package.json shared/
COPY client/package.json client/
RUN pnpm install --frozen-lockfile --filter @waby/client...
COPY shared/ shared/
COPY client/ client/
# Vite la embebe en el build: el navegador llama a esta URL.
ARG VITE_API_URL=http://localhost:3000/api/v1/
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm --filter @waby/shared build && pnpm --filter @waby/client build

FROM nginx:1.27-alpine
COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/client/dist /usr/share/nginx/html
EXPOSE 80
