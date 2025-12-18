# Security Specialist - Technical Reference

## Authentication Methods

### JWT (JSON Web Tokens)

```typescript
// JWT Configuration (NestJS)
import { JwtModule } from '@nestjs/jwt';

JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    secret: config.get('JWT_SECRET'), // Min 256 bits
    signOptions: {
      expiresIn: '15m', // Short-lived access tokens
      algorithm: 'HS256',
      issuer: 'your-app',
      audience: 'your-app-users',
    },
  }),
});
```

### Token Structure

```typescript
// Access Token Payload
interface AccessTokenPayload {
  sub: string;       // User ID
  email: string;
  roles: string[];
  iat: number;       // Issued at
  exp: number;       // Expiry (15 min)
}

// Refresh Token Payload
interface RefreshTokenPayload {
  sub: string;       // User ID
  jti: string;       // JWT ID (for revocation)
  iat: number;
  exp: number;       // Expiry (7 days)
}
```

### Token Refresh Flow

```typescript
@Injectable()
export class AuthService {
  async refreshTokens(refreshToken: string) {
    // 1. Verify refresh token
    const payload = await this.jwtService.verifyAsync(refreshToken, {
      secret: this.config.get('JWT_REFRESH_SECRET'),
    });

    // 2. Check if token is revoked
    const isRevoked = await this.tokenRepository.isRevoked(payload.jti);
    if (isRevoked) {
      throw new UnauthorizedException('Token has been revoked');
    }

    // 3. Rotate refresh token (one-time use)
    await this.tokenRepository.revoke(payload.jti);

    // 4. Issue new tokens
    return this.generateTokenPair(payload.sub);
  }

  private async generateTokenPair(userId: string) {
    const user = await this.userService.findById(userId);
    
    const accessToken = await this.jwtService.signAsync(
      { sub: userId, email: user.email, roles: user.roles },
      { expiresIn: '15m' }
    );

    const refreshToken = await this.jwtService.signAsync(
      { sub: userId, jti: uuid() },
      { secret: this.config.get('JWT_REFRESH_SECRET'), expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
  }
}
```

---

## Password Security

### Hashing with bcrypt

```typescript
import * as bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // Minimum recommended

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}
```

### Password Policy Validation

```typescript
import { IsString, MinLength, Matches } from 'class-validator';

export class PasswordDto {
  @IsString()
  @MinLength(12, { message: 'Password must be at least 12 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;
}

// Policy constants
const PASSWORD_POLICY = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxAge: 90, // days
  preventReuse: 5, // remember last 5 passwords
};
```

---

## Authorization Patterns

### Role-Based Access Control (RBAC)

```typescript
// roles.decorator.ts
import { SetMetadata } from '@nestjs/common';

export enum Role {
  USER = 'user',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
}

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// roles.guard.ts
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required, allow access
    }

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}

// Usage
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard, RolesGuard)
@Delete(':id')
async deleteUser(@Param('id') id: string) {
  return this.userService.delete(id);
}
```

### Resource Ownership Check

```typescript
// ownership.guard.ts
@Injectable()
export class OwnershipGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const resourceId = request.params.id;
    const resourceType = this.reflector.get<string>('resourceType', context.getHandler());

    // Admin bypasses ownership check
    if (user.roles?.includes(Role.ADMIN)) {
      return true;
    }

    // Check ownership based on resource type
    const resource = await this.resourceService.findById(resourceType, resourceId);
    return resource?.userId === user.sub;
  }
}

// ownership.decorator.ts
export const ResourceType = (type: string) => SetMetadata('resourceType', type);

// Usage
@ResourceType('post')
@UseGuards(JwtAuthGuard, OwnershipGuard)
@Put(':id')
async updatePost(@Param('id') id: string, @Body() dto: UpdatePostDto) {
  return this.postService.update(id, dto);
}
```

---

## Input Validation & Sanitization

### DTO Validation

```typescript
import { 
  IsEmail, 
  IsNotEmpty, 
  IsString, 
  MaxLength, 
  IsOptional,
  IsUUID,
  IsInt,
  Min,
  Max 
} from 'class-validator';
import { Transform } from 'class-transformer';
import { sanitize } from 'class-sanitizer';

export class CreateUserDto {
  @IsEmail()
  @Transform(({ value }) => value.toLowerCase().trim())
  email: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Transform(({ value }) => value.trim())
  name: string;

  @IsString()
  @MinLength(12)
  password: string;
}

export class QueryDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Transform(({ value }) => parseInt(value, 10))
  limit?: number = 20;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page?: number = 1;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  @Transform(({ value }) => value?.trim())
  search?: string;
}
```

### HTML Sanitization

```typescript
import * as DOMPurify from 'isomorphic-dompurify';

function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'title'],
  });
}

// For user-generated content
export class CreateCommentDto {
  @IsString()
  @MaxLength(5000)
  @Transform(({ value }) => sanitizeHtml(value))
  content: string;
}
```

---

## Security Headers

### Helmet Configuration

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"], // Avoid if possible
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.example.com"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
}));
```

### CORS Configuration

```typescript
app.enableCors({
  origin: (origin, callback) => {
    const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(',') || [];
    
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page'],
  maxAge: 86400, // 24 hours
});
```

---

## Rate Limiting

```typescript
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

// Global rate limiting
@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,  // 1 second
        limit: 3,   // 3 requests per second
      },
      {
        name: 'medium',
        ttl: 10000, // 10 seconds
        limit: 20,  // 20 requests per 10 seconds
      },
      {
        name: 'long',
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

// Endpoint-specific rate limiting
@Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
@Post('login')
async login(@Body() dto: LoginDto) {
  return this.authService.login(dto);
}

// Skip rate limiting for specific endpoints
@SkipThrottle()
@Get('health')
healthCheck() {
  return { status: 'ok' };
}
```

---

## Secrets Management

### Environment Variables

```typescript
// config/configuration.ts
export default () => ({
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
  },
  database: {
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    password: process.env.DB_PASSWORD,
  },
  encryption: {
    key: process.env.ENCRYPTION_KEY, // 32 bytes for AES-256
  },
});

// Validation
import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  JWT_SECRET: Joi.string().min(32).required(),
  JWT_REFRESH_SECRET: Joi.string().min(32).required(),
  DB_PASSWORD: Joi.string().required(),
  ENCRYPTION_KEY: Joi.string().length(64).required(), // 32 bytes = 64 hex chars
});
```

### Data Encryption

```typescript
import { createCipheriv, createDecipheriv, randomBytes, scrypt } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class EncryptionService {
  private readonly algorithm = 'aes-256-gcm';
  
  async encrypt(plaintext: string, key: Buffer): Promise<string> {
    const iv = randomBytes(16);
    const cipher = createCipheriv(this.algorithm, key, iv);
    
    const encrypted = Buffer.concat([
      cipher.update(plaintext, 'utf8'),
      cipher.final(),
    ]);
    
    const authTag = cipher.getAuthTag();
    
    // Format: iv:authTag:encrypted (all base64)
    return [
      iv.toString('base64'),
      authTag.toString('base64'),
      encrypted.toString('base64'),
    ].join(':');
  }

  async decrypt(ciphertext: string, key: Buffer): Promise<string> {
    const [ivB64, authTagB64, encryptedB64] = ciphertext.split(':');
    
    const iv = Buffer.from(ivB64, 'base64');
    const authTag = Buffer.from(authTagB64, 'base64');
    const encrypted = Buffer.from(encryptedB64, 'base64');
    
    const decipher = createDecipheriv(this.algorithm, key, iv);
    decipher.setAuthTag(authTag);
    
    return Buffer.concat([
      decipher.update(encrypted),
      decipher.final(),
    ]).toString('utf8');
  }
}
```

---

## Security Logging

```typescript
@Injectable()
export class SecurityLogger {
  private readonly logger = new Logger('Security');

  logAuthSuccess(userId: string, ip: string, userAgent: string) {
    this.logger.log({
      event: 'AUTH_SUCCESS',
      userId,
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  }

  logAuthFailure(email: string, ip: string, reason: string) {
    this.logger.warn({
      event: 'AUTH_FAILURE',
      email,
      ip,
      reason,
      timestamp: new Date().toISOString(),
    });
  }

  logAccessDenied(userId: string, resource: string, action: string, ip: string) {
    this.logger.warn({
      event: 'ACCESS_DENIED',
      userId,
      resource,
      action,
      ip,
      timestamp: new Date().toISOString(),
    });
  }

  logSuspiciousActivity(userId: string, activity: string, details: object) {
    this.logger.error({
      event: 'SUSPICIOUS_ACTIVITY',
      userId,
      activity,
      details,
      timestamp: new Date().toISOString(),
    });
  }
}
```

---

## Security Checklist

### Authentication
- [ ] Password hashing with bcrypt (cost factor >= 12)
- [ ] JWT access tokens (15 min expiry)
- [ ] Refresh token rotation (one-time use)
- [ ] Token revocation capability
- [ ] Rate limiting on auth endpoints

### Authorization
- [ ] RBAC implementation
- [ ] Resource ownership validation
- [ ] Principle of least privilege
- [ ] Admin actions logged

### Input Security
- [ ] All inputs validated with DTOs
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (output encoding)
- [ ] File upload restrictions

### Configuration
- [ ] Security headers (Helmet)
- [ ] CORS properly configured
- [ ] HTTPS enforced
- [ ] Secrets in environment variables

### Monitoring
- [ ] Security events logged
- [ ] Failed auth attempts tracked
- [ ] Anomaly detection for suspicious patterns

---

## Related Skills

- **backend-nestjs**: Authentication module implementation
- **backend-fastapi**: Python security patterns
- **database-specialist**: Encryption at rest, access control
- **devops-deployment**: WAF, TLS configuration
