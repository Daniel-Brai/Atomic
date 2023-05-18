import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      driver: require('sqlite3'),
      database: '../atomic.db',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: Boolean(process.env.DB_SYNC),
      logging: Boolean(process.env.DB_LOGGING),
    }),
  ],
})
export class DatabaseModule {}
