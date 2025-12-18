# Backend Domain Context

> Consolidated backend information: architecture, database, API endpoints, services, security.

## Architecture

### Tech Stack
| Technology | Version | Purpose |
|------------|---------|---------|
| Framework | NestJS 10.x | Node.js framework |
| ORM | TypeORM | Database ORM |
| Database | PostgreSQL 16 | Primary database |
| Cache | Redis | Caching layer |
| Auth | Passport + JWT | Authentication |
| Validation | class-validator | Input validation |
| Docs | Swagger | API documentation |

### Project Structure
```
workspace/backend/
├── src/
│   ├── auth/            # Authentication module
│   ├── users/           # User management
│   ├── common/          # Shared utilities
│   │   ├── decorators/  # Custom decorators
│   │   ├── filters/     # Exception filters
│   │   ├── guards/      # Auth guards
│   │   └── pipes/       # Validation pipes
│   ├── config/          # Configuration
│   └── main.ts          # Entry point
├── test/                # E2E tests
└── migrations/          # Database migrations
```

---

## Database Schema

### Entities

#### User
```
User
├── id: UUID (PK)
├── email: VARCHAR(255) UNIQUE NOT NULL
├── password_hash: VARCHAR(255) NOT NULL
├── first_name: VARCHAR(100)
├── last_name: VARCHAR(100)
├── role: ENUM('user', 'admin') DEFAULT 'user'
├── is_active: BOOLEAN DEFAULT true
├── created_at: TIMESTAMP DEFAULT NOW()
└── updated_at: TIMESTAMP DEFAULT NOW()
```

<!-- Add more entities as they are created -->

### Migrations
| # | Name | Description | Status |
|---|------|-------------|--------|
| | | | |

### Indexes
| Table | Column(s) | Type | Purpose |
|-------|-----------|------|---------|
| users | email | UNIQUE | Fast lookup |

---

## API Endpoints

### Auth Module `/api/auth`
| Method | Path | Description | Auth | Body | Response | Status |
|--------|------|-------------|------|------|----------|--------|
| POST | /register | User registration | No | `{email, password, firstName?, lastName?}` | `{user, accessToken, refreshToken}` | Pending |
| POST | /login | User login | No | `{email, password}` | `{user, accessToken, refreshToken}` | Pending |
| POST | /refresh | Refresh token | No | `{refreshToken}` | `{accessToken, refreshToken}` | Pending |
| POST | /logout | User logout | Yes | - | `{success: true}` | Pending |

### Users Module `/api/users`
| Method | Path | Description | Auth | Body | Response | Status |
|--------|------|-------------|------|------|----------|--------|
| GET | /me | Get current user | Yes | - | `User` | Pending |
| PATCH | /me | Update profile | Yes | `{firstName?, lastName?}` | `User` | Pending |

<!-- Add more modules as they are created -->

---

## Service Architecture

### Module Dependencies
```
AuthModule
├── UsersModule
├── JwtModule
└── PassportModule

UsersModule
├── TypeOrmModule (User)
└── CommonModule
```

### External Integrations
| Service | Provider | Purpose | Config |
|---------|----------|---------|--------|
| Email | SendGrid | Transactional emails | `SENDGRID_API_KEY` |
| Storage | AWS S3 | File storage | `AWS_*` |
| Cache | Redis | Session/cache | `REDIS_URL` |

---

## Security

### Implemented
- [ ] Password hashing (bcrypt, rounds: 12)
- [ ] JWT access tokens (15min expiry)
- [ ] JWT refresh tokens (7d expiry)
- [ ] Rate limiting (100 req/min per IP)
- [ ] CORS configuration
- [ ] Helmet security headers
- [ ] Input validation (class-validator)
- [ ] SQL injection prevention (TypeORM)

### Security Headers
```typescript
// Helmet configuration
{
  contentSecurityPolicy: true,
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: true,
  dnsPrefetchControl: true,
  frameguard: true,
  hidePoweredBy: true,
  hsts: true,
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: true,
  xssFilter: true
}
```

---

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| DATABASE_URL | PostgreSQL connection | Yes | - |
| JWT_SECRET | JWT signing secret | Yes | - |
| JWT_EXPIRY | Access token expiry | No | 15m |
| REDIS_URL | Redis connection | No | - |

---

## Performance Targets

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Response Time (p95) | <200ms | - | - |
| Throughput | >1000 RPS | - | - |
| Error Rate | <0.1% | - | - |
| Availability | 99.9% | - | - |

---

## Notes

<!-- Additional backend notes and decisions -->
