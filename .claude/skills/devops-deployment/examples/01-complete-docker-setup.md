# Complete Docker Setup Example

**Production-Ready Docker Configuration for Full-Stack Applications**

> **When to Use**: Every production deployment
> **Skill**: devops-deployment
> **Related**: backend-nestjs (API), frontend-nextjs (UI), systemdev-specialist (GPU)

---

## Overview

This example demonstrates a complete Docker setup:
- Multi-stage builds for optimization
- Docker Compose for local development
- Production-ready configurations
- Health checks and monitoring
- Volume management
- Network isolation
- Secret management
- GPU support (optional)

**Architecture**: Frontend + Backend + Database + Redis + NGINX

## System Architecture

```
Docker Network: app-network
┌────────────────────────────────────────────────────────┐
│                                                        │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐       │
│  │ NGINX    │───▶│ Frontend │    │ Backend  │       │
│  │ :80,:443 │    │ :3000    │◀───│ :4000    │       │
│  └──────────┘    └──────────┘    └──────────┘       │
│                                          │            │
│                          ┌───────────────┼────────┐  │
│                          ▼               ▼        ▼  │
│                   ┌───────────┐   ┌────────┐  ┌─────┐
│                   │ PostgreSQL│   │ Redis  │  │ S3  │
│                   │ :5432     │   │ :6379  │  │Mock │
│                   └───────────┘   └────────┘  └─────┘
│                                                        │
└────────────────────────────────────────────────────────┘
```

## Complete Implementation

### 1. Frontend Dockerfile (Next.js)

```dockerfile
# frontend/Dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build application
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/api/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]
```

### 2. Backend Dockerfile (Nest.js)

```dockerfile
# backend/Dockerfile
# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build && \
    npm prune --production

# Stage 3: Runner
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs nodejs

# Copy built application
COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist
COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nodejs:nodejs /app/package.json ./

USER nodejs

EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://localhost:4000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Use dumb-init to handle signals
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/main.js"]
```

### 3. Docker Compose (Development)

```yaml
# docker-compose.yml
version: '3.8'

services:
  # PostgreSQL Database
  postgres:
    image: postgres:15-alpine
    container_name: postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:-postgres}
      POSTGRES_DB: ${POSTGRES_DB:-appdb}
      PGDATA: /var/lib/postgresql/data/pgdata
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-db:/docker-entrypoint-initdb.d
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - app-network
    restart: unless-stopped

  # Redis Cache
  redis:
    image: redis:7-alpine
    container_name: redis
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD:-redis}
    volumes:
      - redis_data:/data
    ports:
      - "${REDIS_PORT:-6379}:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "--raw", "incr", "ping"]
      interval: 10s
      timeout: 3s
      retries: 5
    networks:
      - app-network
    restart: unless-stopped

  # Backend API
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
      target: runner
    container_name: backend
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      PORT: 4000
      DATABASE_URL: postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD:-postgres}@postgres:5432/${POSTGRES_DB:-appdb}
      REDIS_URL: redis://:${REDIS_PASSWORD:-redis}@redis:6379
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
      AWS_ACCESS_KEY_ID: ${AWS_ACCESS_KEY_ID}
      AWS_SECRET_ACCESS_KEY: ${AWS_SECRET_ACCESS_KEY}
      AWS_REGION: ${AWS_REGION}
      AWS_S3_BUCKET: ${AWS_S3_BUCKET}
    volumes:
      - ./backend:/app
      - /app/node_modules
      - backend_uploads:/app/uploads
    ports:
      - "${BACKEND_PORT:-4000}:4000"
    networks:
      - app-network
    restart: unless-stopped

  # Frontend
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
      target: runner
    container_name: frontend
    depends_on:
      - backend
    environment:
      NODE_ENV: ${NODE_ENV:-development}
      NEXT_PUBLIC_API_URL: http://backend:4000
    volumes:
      - ./frontend:/app
      - /app/node_modules
      - /app/.next
    ports:
      - "${FRONTEND_PORT:-3000}:3000"
    networks:
      - app-network
    restart: unless-stopped

  # NGINX Reverse Proxy
  nginx:
    image: nginx:alpine
    container_name: nginx
    depends_on:
      - frontend
      - backend
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
    ports:
      - "80:80"
      - "443:443"
    networks:
      - app-network
    restart: unless-stopped

volumes:
  postgres_data:
    driver: local
  redis_data:
    driver: local
  backend_uploads:
    driver: local

networks:
  app-network:
    driver: bridge
```

### 4. Docker Compose (Production)

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: ${POSTGRES_USER}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
      POSTGRES_DB: ${POSTGRES_DB}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network
    restart: always
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
        reservations:
          cpus: '1'
          memory: 1G

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    networks:
      - app-network
    restart: always
    deploy:
      resources:
        limits:
          cpus: '1'
          memory: 512M

  backend:
    image: ${REGISTRY}/backend:${VERSION:-latest}
    environment:
      NODE_ENV: production
      DATABASE_URL: ${DATABASE_URL}
      REDIS_URL: ${REDIS_URL}
      JWT_SECRET: ${JWT_SECRET}
      JWT_REFRESH_SECRET: ${JWT_REFRESH_SECRET}
    secrets:
      - aws_credentials
      - jwt_secret
    networks:
      - app-network
    restart: always
    deploy:
      replicas: 3
      update_config:
        parallelism: 1
        delay: 10s
        failure_action: rollback
      resources:
        limits:
          cpus: '1'
          memory: 1G

  frontend:
    image: ${REGISTRY}/frontend:${VERSION:-latest}
    environment:
      NODE_ENV: production
      NEXT_PUBLIC_API_URL: ${API_URL}
    networks:
      - app-network
    restart: always
    deploy:
      replicas: 2
      resources:
        limits:
          cpus: '0.5'
          memory: 512M

  nginx:
    image: nginx:alpine
    volumes:
      - ./nginx/nginx.prod.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - ./nginx/cache:/var/cache/nginx
    ports:
      - "80:80"
      - "443:443"
    networks:
      - app-network
    restart: always
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M

volumes:
  postgres_data:
    external: true
  redis_data:
    external: true

networks:
  app-network:
    driver: overlay

secrets:
  aws_credentials:
    external: true
  jwt_secret:
    external: true
```

### 5. NGINX Configuration

```nginx
# nginx/nginx.conf
user nginx;
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 65;
    types_hash_max_size 2048;
    client_max_body_size 100M;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml text/javascript
               application/json application/javascript application/xml+rss;

    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    limit_req_zone $binary_remote_addr zone=general:10m rate=30r/s;

    # Upstream servers
    upstream frontend {
        least_conn;
        server frontend:3000 max_fails=3 fail_timeout=30s;
    }

    upstream backend {
        least_conn;
        server backend:4000 max_fails=3 fail_timeout=30s;
    }

    # HTTP to HTTPS redirect
    server {
        listen 80;
        server_name example.com www.example.com;
        return 301 https://$server_name$request_uri;
    }

    # HTTPS server
    server {
        listen 443 ssl http2;
        server_name example.com www.example.com;

        # SSL configuration
        ssl_certificate /etc/nginx/ssl/cert.pem;
        ssl_certificate_key /etc/nginx/ssl/key.pem;
        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

        # API routes
        location /api {
            limit_req zone=api burst=20 nodelay;

            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;

            # Timeouts
            proxy_connect_timeout 60s;
            proxy_send_timeout 60s;
            proxy_read_timeout 60s;
        }

        # WebSocket routes
        location /socket.io {
            proxy_pass http://backend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "upgrade";
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }

        # Frontend routes
        location / {
            limit_req zone=general burst=50 nodelay;

            proxy_pass http://frontend;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }

        # Static files cache
        location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2|ttf|eot)$ {
            proxy_pass http://frontend;
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
```

### 6. Environment Configuration

```bash
# .env.example
# Application
NODE_ENV=production
PORT=4000
FRONTEND_PORT=3000

# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=secure_password_here
POSTGRES_DB=appdb
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:secure_password_here@postgres:5432/appdb

# Redis
REDIS_PASSWORD=secure_redis_password
REDIS_URL=redis://:secure_redis_password@redis:6379

# JWT
JWT_SECRET=your_jwt_secret_here_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_here_min_32_chars

# AWS
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# Registry
REGISTRY=your-registry.com
VERSION=1.0.0
```

### 7. Docker Ignore

```
# .dockerignore
node_modules
npm-debug.log
.next
.git
.gitignore
.env
.env.local
.env.*.local
dist
coverage
.DS_Store
*.log
README.md
```

### 8. Makefile for Common Operations

```makefile
# Makefile
.PHONY: build up down logs restart clean

# Development
build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

logs:
	docker-compose logs -f

restart:
	docker-compose restart

# Production
build-prod:
	docker-compose -f docker-compose.prod.yml build

up-prod:
	docker-compose -f docker-compose.prod.yml up -d

down-prod:
	docker-compose -f docker-compose.prod.yml down

# Database
db-migrate:
	docker-compose exec backend npm run migrate

db-seed:
	docker-compose exec backend npm run seed

# Cleanup
clean:
	docker-compose down -v
	docker system prune -f

# Health check
health:
	@echo "Checking services health..."
	@docker-compose ps
```

## Multi-Stage Build Benefits

1. **Smaller Image Size**: Only production dependencies in final image
2. **Layer Caching**: Faster builds with cached layers
3. **Security**: No build tools in production image
4. **Separation**: Clear separation of build and runtime

## Volume Management

```bash
# Create named volumes
docker volume create postgres_data
docker volume create redis_data

# Backup volume
docker run --rm -v postgres_data:/data -v $(pwd):/backup \
  alpine tar czf /backup/postgres_backup.tar.gz /data

# Restore volume
docker run --rm -v postgres_data:/data -v $(pwd):/backup \
  alpine tar xzf /backup/postgres_backup.tar.gz -C /data
```

## Security Best Practices

1. **Non-Root User**: Run containers as non-root
2. **Secrets**: Use Docker secrets for sensitive data
3. **Network Isolation**: Separate networks for services
4. **Resource Limits**: Set CPU/memory limits
5. **Health Checks**: Monitor container health
6. **SSL/TLS**: HTTPS with valid certificates

## Key Patterns

1. **Multi-Stage Builds**: Optimize image size
2. **Health Checks**: Container health monitoring
3. **Volume Persistence**: Data persistence across restarts
4. **Network Isolation**: Security through network segmentation
5. **Resource Limits**: Prevent resource exhaustion
6. **Restart Policies**: Auto-recovery from failures
7. **Logging**: Centralized log management

## Common Pitfalls

❌ **DON'T**:
- Run as root user
- Store secrets in images
- Use latest tag in production
- Forget health checks
- Skip resource limits

✅ **DO**:
- Use non-root users
- Use Docker secrets
- Pin specific versions
- Implement health checks
- Set resource limits

## Related Examples

- **Backend**: `backend-nestjs/examples/01-authentication-module.md`
- **Frontend**: `frontend-nextjs/examples/01-authentication-pages.md`
- **CI/CD**: `02-cicd-pipeline.md`
