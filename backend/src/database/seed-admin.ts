import 'dotenv/config';

import * as argon2 from 'argon2';

import { AppDataSource } from './data-source.js';
import { User, UserStatus } from '../users/entities/user.entity.js';

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  const firstName = process.env.ADMIN_FIRST_NAME ?? 'System';
  const lastName = process.env.ADMIN_LAST_NAME ?? 'Administrator';

  if (!email || !password) {
    throw new Error(
      'ADMIN_EMAIL and ADMIN_PASSWORD must be configured in .env',
    );
  }

  if (password.length < 8) {
    throw new Error('Admin password must contain at least 8 characters');
  }

  await AppDataSource.initialize();

  try {
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      console.log(`Admin user already exists: ${email}`);
      return;
    }

    const passwordHash = await argon2.hash(password, {
      type: argon2.argon2id,
    });

    const user = userRepository.create({
      email,
      passwordHash,
      firstName,
      lastName,
      status: UserStatus.ACTIVE,
    });

    await userRepository.save(user);

    console.log(`Admin user created: ${email}`);
  } finally {
    await AppDataSource.destroy();
  }
}

seedAdmin().catch((error) => {
  console.error('Admin seeding failed:', error);
  process.exitCode = 1;
});