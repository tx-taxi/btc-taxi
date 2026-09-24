FROM node:24-bookworm-slim AS frontend-builder

WORKDIR /app/frontend
RUN apt-get update \
    && apt-get install -y --no-install-recommends rsync \
    && rm -rf /var/lib/apt/lists/*
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend ./
RUN SKIP_SYNC=1 npm run build

FROM node:24-bookworm-slim

RUN apt-get update \
    && apt-get install -y --no-install-recommends nginx fonts-dejavu-core curl \
    && rm -f /etc/nginx/sites-enabled/default \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app
COPY og/package.json og/package-lock.json ./og/
RUN cd og && npm ci --omit=dev
COPY og/server.cjs ./og/server.cjs

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=frontend-builder /app/frontend/dist/mempool/browser /usr/share/nginx/html

EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=5s --start-period=10s --retries=3 CMD node -e "Promise.all([fetch('http://127.0.0.1:8080/healthz'), fetch('http://127.0.0.1:8081/healthz')]).then(r => process.exit(r.every(x => x.ok) ? 0 : 1)).catch(() => process.exit(1))"
CMD ["sh", "-c", "node /app/og/server.cjs & exec nginx -g 'daemon off;'"]
