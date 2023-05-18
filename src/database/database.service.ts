import { Logger } from '@nestjs/common';
import { cwd } from 'process';
import { DataSource } from 'typeorm';

export class DatabaseService {
  static async connect(): Promise<void> {
    const logger: Logger = new Logger();
    const ConnectionSource = new DataSource({
      type: 'sqlite',
      driver: require('sqlite3'),
      database: '../atomic.db',
      entities: [cwd() + '/apps/server/src/**/*.entity.js'],
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
