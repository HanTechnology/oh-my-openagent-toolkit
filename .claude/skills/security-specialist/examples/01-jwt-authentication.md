# JWT Authentication Implementation Example

**Complete JWT Authentication with Refresh Tokens**

> **When to Use**: Implementing user authentication for APIs
> **Skill**: security-specialist
> **Related**: backend-nestjs (auth module), frontend-nextjs (token storage)

---

## Architecture Overview

```
Client                        Server
  |                              |
  |------ Login (email/pwd) ---->|
  |                              |-- Validate credentials
  |                              |-- Generate access token (15m)
  |                              |-- Generate refresh token (7d)
  |<---- { accessToken,          |
  |        refreshToken } -------|
  |                              |
  |------ API Request ---------->|
  |       (Bearer accessToken)   |-- Verify token
  |                              |-- Extract user from payload
  |<---- Response ---------------|
  |                              |
  |------ Refresh Request ------>|
  |       (refreshToken)         |-- Verify refresh token
  |                              |-- Check not revoked
  |                              |-- Revoke old refresh token
  |                              |-- Generate new token pair
  |<---- { accessToken,          |
  |        refreshToken } -------|
```

---

## Implementation

### 1. DTOs and Interfaces

```typescript
// dto/auth.dto.ts
import { IsEmail, IsNotEmpty, MinLength, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsNotEmpty({ message: 'Password is required' })
  password: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsNotEmpty()
  @MinLength(12, { message: 'Password must be at least 12 characters' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/, {
    message: 'Password must contain uppercase, lowercase, number, and special character',
  })
  password: string;
}

// interfaces/auth.interface.ts
export interface TokenPayload {
  sub: string;      // User ID
  email: string;
  roles: string[];
}

export interface RefreshTokenPayload {
  sub: string;
  jti: string;      // JWT ID for revocation
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    roles: string[];
  };
  accessToken: string;
  refreshToken: string;
}
```

### 2. Token Entity (for Revocation)

```typescript
// entities/refresh-token.entity.ts
import { Entity, Column, PrimaryColumn, CreateDateColumn, Index } from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryColumn()
  jti: string;  // JWT ID

  @Column()
  @Index()
  userId: string;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  isRevoked: boolean;

  @CreateDateColumn()
  createdAt: Date;
}
```

### 3. Auth Service

```typescript
// auth.service.ts
import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from 'uuid';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from './entities/refresh-token.entity';
import { LoginDto, RegisterDto, AuthResponse } from './dto/auth.dto';
import { SecurityLogger } from './security-logger.service';

@Injectable()
export class AuthService {
  private readonly SALT_ROUNDS = 12;
  private readonly ACCESS_TOKEN_TTL = '15m';
  private readonly REFRESH_TOKEN_TTL = '7d';
  private readonly REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(RefreshToken)
    private tokenRepository: Repository<RefreshToken>,
    private jwtService: JwtService,
    private configService: ConfigService,
    private securityLogger: SecurityLogger,
  ) {}

  async register(dto: RegisterDto, ip: string): Promise<AuthResponse> {
    // Check if user exists
    const existingUser = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const passwordHash = await bcrypt.hash(dto.password, this.SALT_ROUNDS);

    // Create user
    const user = await this.userRepository.save({
      email: dto.email.toLowerCase(),
      passwordHash,
      name: dto.name,
      roles: ['user'],
    });

    // Generate tokens
    const tokens = await this.generateTokenPair(user);

    this.securityLogger.logAuthSuccess(user.id, ip, 'REGISTER');

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
      ...tokens,
    };
  }

  async login(dto: LoginDto, ip: string): Promise<AuthResponse> {
    // Find user
    const user = await this.userRepository.findOne({
      where: { email: dto.email.toLowerCase() },
    });

    if (!user) {
      this.securityLogger.logAuthFailure(dto.email, ip, 'USER_NOT_FOUND');
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const passwordValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordValid) {
      this.securityLogger.logAuthFailure(dto.email, ip, 'INVALID_PASSWORD');
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const tokens = await this.generateTokenPair(user);

    this.securityLogger.logAuthSuccess(user.id, ip, 'LOGIN');

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles,
      },
      ...tokens,
    };
  }

  async refreshTokens(refreshToken: string, ip: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
      });

      // Check if token is revoked
      const tokenRecord = await this.tokenRepository.findOne({
        where: { jti: payload.jti },
      });

      if (!tokenRecord || tokenRecord.isRevoked) {
        this.securityLogger.logSuspiciousActivity(payload.sub, 'REVOKED_TOKEN_USE', { jti: payload.jti });
        throw new UnauthorizedException('Token has been revoked');
      }

      // Revoke old token (rotation)
      await this.tokenRepository.update({ jti: payload.jti }, { isRevoked: true });

      // Get user for new token
      const user = await this.userRepository.findOne({ where: { id: payload.sub } });

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // Generate new token pair
      return this.generateTokenPair(user);

    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      this.securityLogger.logAuthFailure('unknown', ip, 'INVALID_REFRESH_TOKEN');
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string, refreshToken?: string): Promise<void> {
    if (refreshToken) {
      try {
        const payload = await this.jwtService.verifyAsync<RefreshTokenPayload>(refreshToken, {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
        });
        await this.tokenRepository.update({ jti: payload.jti }, { isRevoked: true });
      } catch {
        // Token invalid, but logout should still succeed
      }
    }

    // Optionally: Revoke all user tokens
    // await this.tokenRepository.update({ userId }, { isRevoked: true });
  }

  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.tokenRepository.update({ userId, isRevoked: false }, { isRevoked: true });
  }

  private async generateTokenPair(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const jti = uuid();

    // Access token
    const accessToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        roles: user.roles,
      },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.ACCESS_TOKEN_TTL,
      },
    );

    // Refresh token
    const refreshToken = await this.jwtService.signAsync(
      {
        sub: user.id,
        jti,
      },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET'),
        expiresIn: this.REFRESH_TOKEN_TTL,
      },
    );

    // Store refresh token for revocation tracking
    await this.tokenRepository.save({
      jti,
      userId: user.id,
      expiresAt: new Date(Date.now() + this.REFRESH_TOKEN_TTL_MS),
    });

    return { accessToken, refreshToken };
  }

  // Cleanup expired tokens (run via cron)
  async cleanupExpiredTokens(): Promise<void> {
    await this.tokenRepository.delete({
      expiresAt: LessThan(new Date()),
    });
  }
}
```

### 4. JWT Strategy

```typescript
// strategies/jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from '../interfaces/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET'),
      algorithms: ['HS256'],
    });
  }

  async validate(payload: TokenPayload) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      userId: payload.sub,
      email: payload.email,
      roles: payload.roles || [],
    };
  }
}
```

### 5. Auth Controller

```typescript
// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Ip,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Throttle } from '@nestjs/throttler';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'Email already exists' })
  @Throttle({ default: { limit: 5, ttl: 60000 } }) // 5 requests per minute
  register(@Body() dto: RegisterDto, @Ip() ip: string) {
    return this.authService.register(dto, ip);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login user' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @Throttle({ default: { limit: 10, ttl: 60000 } }) // 10 requests per minute
  login(@Body() dto: LoginDto, @Ip() ip: string) {
    return this.authService.login(dto, ip);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refresh access token' })
  @ApiResponse({ status: 200, description: 'Tokens refreshed' })
  @ApiResponse({ status: 401, description: 'Invalid refresh token' })
  @Throttle({ default: { limit: 30, ttl: 60000 } }) // 30 requests per minute
  refreshTokens(@Body('refreshToken') refreshToken: string, @Ip() ip: string) {
    return this.authService.refreshTokens(refreshToken, ip);
  }

  @Post('logout')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user' })
  async logout(@Req() req, @Body('refreshToken') refreshToken?: string) {
    await this.authService.logout(req.user.userId, refreshToken);
  }

  @Post('logout-all')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout from all devices' })
  async logoutAll(@Req() req) {
    await this.authService.revokeAllUserTokens(req.user.userId);
  }
}
```

---

## Security Features

### Rate Limiting
- Registration: 5 requests/minute
- Login: 10 requests/minute
- Token refresh: 30 requests/minute

### Token Security
- Access token: 15 minutes expiry
- Refresh token: 7 days expiry, one-time use
- Refresh token rotation prevents reuse attacks
- All tokens can be revoked

### Password Security
- Minimum 12 characters
- Requires uppercase, lowercase, number, special character
- bcrypt hashing with cost factor 12

### Logging
- All auth events logged with IP
- Failed attempts tracked
- Suspicious activity flagged

---

## Frontend Integration

```typescript
// Token storage (secure)
const storeTokens = (accessToken: string, refreshToken: string) => {
  // Access token in memory only (not localStorage)
  window.__accessToken = accessToken;
  
  // Refresh token in httpOnly cookie (set by server) or secure storage
  // If SPA, use memory with persistence strategy
};

// Auto-refresh interceptor
axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const { accessToken, refreshToken } = await refreshTokens();
        storeTokens(accessToken, refreshToken);
        
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch {
        // Refresh failed, redirect to login
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);
```

---

## Key Patterns

1. **Token Rotation**: Refresh tokens are one-time use
2. **Revocation Tracking**: JTI stored in database for revocation
3. **Security Logging**: All auth events logged with context
4. **Rate Limiting**: Prevents brute force attacks
5. **Password Policy**: Strong requirements enforced

## Best Practices

- Never store access tokens in localStorage
- Use httpOnly cookies for refresh tokens when possible
- Implement token refresh before expiry
- Log all authentication events
- Rate limit all auth endpoints

## Related Examples

- **Frontend**: `frontend-nextjs/examples/` - Token storage patterns
- **Backend Module**: `backend-nestjs/examples/01-authentication-module.md`
