import {
  INestApplication,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

const logger = new Logger();

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
    logger.log(
      '[Database]: Database through Prisma Client started successfully...',
    );
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
      logger.log(
        '[Database]: Database through Prisma Client shut down gracefully...',
      );
    });
  }
}
