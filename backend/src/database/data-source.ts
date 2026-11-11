import 'dotenv/config';

import { DataSource } from 'typeorm';

import { User } from '../users/entities/user.entity.js';
import { RefreshToken } from './entities/refresh-token.entity.js';

import { CreateAuthTables1731150000000 } from './migrations/1731150000000-CreateAuthTables.js';

export const AppDataSource = new DataSource({
  type: 'postgres',

  url: process.env.DATABASE_URL,

  entities: [
    User,
    RefreshToken,
  ],

  migrations: [
    CreateAuthTables1731150000000,
  ],

  synchronize: false,

  migrationsRun: false,

  logging: process.env.NODE_ENV === 'development',
});