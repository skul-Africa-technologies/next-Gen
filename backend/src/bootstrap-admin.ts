import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { UsersService } from './users/users.service';
import { UserRole } from './auth/schemas/user.schema';

async function bootstrapAdmin() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn'],
  });

  const configService = app.get(ConfigService);
  const usersService = app.get(UsersService);

  const adminEmail = configService.get<string>('ADMIN_EMAIL');
  const adminPassword = configService.get<string>('ADMIN_PASSWORD');

  if (!adminEmail || !adminPassword) {
    console.error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  const adminExists = await usersService.findOneByRole(UserRole.ADMIN);

  if (adminExists) {
    console.log('Admin already exists');
    await app.close();
    process.exit(0);
  }

  try {
    const admin = await usersService.createAdmin({
      email: adminEmail,
      password: adminPassword,
      name: 'Admin',
    });

    console.log(`Admin created successfully: ${admin.email}`);
    await app.close();
    process.exit(0);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to create admin:', message);
    await app.close();
    process.exit(1);
  }
}

bootstrapAdmin();