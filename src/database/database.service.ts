import { Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from '../user/entities/users.entity';
import { Link } from '../link/entities/link.entity';
import { resolve } from 'node:path';

export class DatabaseService {
  static async connect(): Promise<void> {
    const logger: Logger = new Logger();
    const ConnectionSource = new DataSource({
      type: 'sqlite',
      driver: require('sqlite3'),
      database: resolve(__dirname, '../atomic.db'),
      entities: [User, Link],
      synchronize: Boolean(process.env.DB_SYNC),
      logging: Boolean(process.env.DB_LOGGING),
    });

    await ConnectionSource.initialize()
      .then(() => logger.log('[Database]: DataSource connection successful...'))
      .catch((e) =>
        logger.error(`[Database]: DataSource connection failed: ${e.msg}`),
      );
  }
}
