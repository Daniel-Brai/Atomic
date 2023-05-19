import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/users.entity';
import { Link } from '../link/entities/link.entity';
import { resolve } from 'node:path';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      driver: require('sqlite3'),
      database: resolve(__dirname, '../atomic.db'),
      entities: [User, Link],
      synchronize: Boolean(process.env.DB_SYNC),
      logging: Boolean(process.env.DB_LOGGING),
    }),
  ],
})
export class DatabaseModule {}
