import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Res,
    UseGuards,
  } from '@nestjs/common';
  
  import { ApiOperation, ApiTags } from '@nestjs/swagger';
  import { Throttle, ThrottlerGuard } from '@nestjs/throttler';
  
  import type { Response } from 'express';
  
  import { ConfigService } from '@nestjs/config';
  
  import { AuthService } from './auth.service.js';
  import { LoginDto } from './dto/login.dto.js';
  
  @ApiTags('Authentication')
  @Controller('auth')
  export class AuthController {
    constructor(
      private readonly authService: AuthService,
      private readonly configService: ConfigService,
    ) {}
  
    @Post('login')
    @HttpCode(HttpStatus.OK)
    @UseGuards(ThrottlerGuard)
    @Throttle({ default: { limit: 10, ttl: 60000 } })
    @ApiOperation({ summary: 'Authenticate a user' })
    async login(
      @Body() loginDto: LoginDto,
      @Res({ passthrough: true }) response: Response,
    ) {
      const result = await this.authService.login(loginDto);
  
      const cookieName =
        this.configService.get<string>('COOKIE_NAME') ??
        'opspilot_refresh';
  
      const cookieSecure =
        this.configService.get<string>('COOKIE_SECURE') === 'true';
  
      const sameSite =
        this.configService.get<string>('COOKIE_SAME_SITE') ?? 'lax';
  
      const maxAge =
        result.refreshExpiresAt.getTime() - Date.now();
  
      response.cookie(cookieName, result.refreshToken, {
        httpOnly: true,
        secure: cookieSecure,
        sameSite: sameSite as 'lax' | 'strict' | 'none',
        path: '/api/v1/auth',
        maxAge,
      });
  
      return {
        success: true,
        message: 'Login successful',
        data: {
          accessToken: result.accessToken,
          tokenType: 'Bearer',
          expiresIn: 900,
          user: result.user,
        },
      };
    }
  }