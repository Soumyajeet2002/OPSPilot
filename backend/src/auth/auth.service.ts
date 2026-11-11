import {
    ForbiddenException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  
  import { InjectRepository } from '@nestjs/typeorm';
  import { Repository } from 'typeorm';
  
  import { JwtService } from '@nestjs/jwt';
  import { ConfigService } from '@nestjs/config';
  
  import * as argon2 from 'argon2';
  import { createHash, randomBytes } from 'node:crypto';
  
  import { User, UserStatus } from '../users/entities/user.entity.js';
  import { RefreshToken } from '../database/entities/refresh-token.entity.js';
  import { LoginDto } from './dto/login.dto.js';
  
  @Injectable()
  export class AuthService {
    constructor(
      @InjectRepository(User)
      private readonly userRepository: Repository<User>,
  
      @InjectRepository(RefreshToken)
      private readonly refreshTokenRepository: Repository<RefreshToken>,
  
      private readonly jwtService: JwtService,
  
      private readonly configService: ConfigService,
    ) {}
  
    async login(loginDto: LoginDto) {
      const email = loginDto.email.trim().toLowerCase();
  
      // Explicitly select passwordHash for verification.
      const user = await this.userRepository
        .createQueryBuilder('user')
        .addSelect('user.passwordHash')
        .where('LOWER(user.email) = :email', { email })
        .getOne();
  
      if (!user) {
        throw new UnauthorizedException({
          success: false,
          message: 'Invalid email or password',
          error: {
            code: 'INVALID_CREDENTIALS',
          },
        });
      }
  
      const passwordMatches = await argon2.verify(
        user.passwordHash,
        loginDto.password,
      );
  
      if (!passwordMatches) {
        throw new UnauthorizedException({
          success: false,
          message: 'Invalid email or password',
          error: {
            code: 'INVALID_CREDENTIALS',
          },
        });
      }
  
      if (user.status === UserStatus.DISABLED) {
        throw new ForbiddenException({
          success: false,
          message: 'Your account is disabled',
          error: {
            code: 'ACCOUNT_DISABLED',
          },
        });
      }
  
      if (user.status === UserStatus.SUSPENDED) {
        throw new ForbiddenException({
          success: false,
          message: 'Your account is suspended',
          error: {
            code: 'ACCOUNT_SUSPENDED',
          },
        });
      }
  
      const rememberMe = loginDto.rememberMe ?? false;
  
      const refreshDays = Number(
        this.configService.get<string>(
          rememberMe
            ? 'REFRESH_TOKEN_REMEMBER_DAYS'
            : 'REFRESH_TOKEN_DAYS',
        ),
      );
  
      const accessToken = await this.jwtService.signAsync({
        sub: user.id,
        email: user.email,
      });
  
      // Generate a cryptographically random opaque refresh token.
      const refreshToken = randomBytes(64).toString('base64url');
  
      // Store its hash, never the raw token.
      const tokenHash = createHash('sha256')
        .update(refreshToken)
        .digest('hex');
  
      const refreshExpiresAt = new Date(
        Date.now() + refreshDays * 24 * 60 * 60 * 1000,
      );
  
      await this.refreshTokenRepository.save(
        this.refreshTokenRepository.create({
          userId: user.id,
          tokenHash,
          rememberMe,
          expiresAt: refreshExpiresAt,
          revokedAt: null,
        }),
      );
  
      return {
        accessToken,
        refreshToken,
        refreshExpiresAt,
  
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
        },
      };
    }
  }