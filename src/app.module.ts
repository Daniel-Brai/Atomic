import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppClusterService } from './app-cluster.service';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './user/users.module';
import { LinkModule } from './link/link.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    LinkModule,
  ],
  controllers: [AppController],
  providers: [AppService, AppClusterService],
})
export class AppModule {}
