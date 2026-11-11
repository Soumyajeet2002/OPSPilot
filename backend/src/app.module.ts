import { Module } from '@nestjs/common';

import { ConfigModule, ConfigService } from '@nestjs/config';

import { TypeOrmModule } from '@nestjs/typeorm';

import { ThrottlerModule } from '@nestjs/throttler';

import { AuthModule } from './auth/auth.module.js';

import { User } from './users/entities/user.entity.js';
import { RefreshToken } from './database/entities/refresh-token.entity.js';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],

      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres' as const,

        url: configService.getOrThrow<string>('DATABASE_URL'),

        entities: [
          User,
          RefreshToken,
        ],

        synchronize: false,

        migrationsRun: false,

        autoLoadEntities: true,

        logging:
          configService.get<string>('NODE_ENV') === 'development',
      }),
    }),

    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),

    AuthModule,
  ],
})
export class AppModule {}