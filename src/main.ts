import { NestFactory, Reflector } from '@nestjs/core';
import {
  ValidationPipe,
  Logger,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
// import { AppClusterService } from './app-cluster.service';
import { DatabaseService as database } from './database/database.service';
import { HttpExceptionFilter } from './libs/filters/http-exception.filter';
import { createClient } from 'redis';
import { join } from 'path';
import { IsAuthenticated } from './auth/helpers/auth.helper';
import * as createRedisStore from 'connect-redis';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import * as passport from 'passport';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as exp from 'express';

const logger: Logger = new Logger();
const PORT: number = +process.env.PORT || 3000;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  });
  const reflector = app.get(Reflector);

  const configService = app.get(ConfigService);

  const RedisStore = createRedisStore(session);
  const redisHost: string = configService.get<string>('REDIS_CLIENT');
  const redisPort: number = +configService.get<number>('REDIS_PORT');
  const RedisClient = createClient({
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    host: redisHost,
    port: redisPort,
  });

  RedisClient.on('error', (e) => {
    logger.error(`[Redis]: Redis connection failed: ${e.msg}...`);
  });
  RedisClient.on('connect', () => {
    logger.log('[Redis]: Redis connection successful...');
  });

  app.use(
    session({
      store: new RedisStore({ client: RedisClient }),
      secret:
        configService.get<string>('SESSION_SECRET_KEY') ||
        "4itjg.-4o/-o.4/0ptk,/.'/le/'rl'rxer/x]r'[f/xr/or/k'/r/,",
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 3600000, httpOnly: true, sameSite: 'strict' },
    }),
  );
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(cookieParser());
  app.use((req: exp.Request, res: exp.Response, next: exp.NextFunction) => {
    res.locals.isAuthenticated = IsAuthenticated.bind(null, req);
    next();
  });
  app.use(exp.urlencoded({ extended: true }));
  app.use(
    helmet.contentSecurityPolicy({
      useDefaults: true,
      directives: {
        'img-src': ["'self'", 'https: data:'],
      },
    }),
  );

  app.use(compression());

  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.setViewEngine('ejs');
  app.useStaticAssets(join(__dirname, '../client/public/assets'));
  app.setBaseViewsDir(join(__dirname, '../client/pages'));

  await app.listen(PORT);
  await database.connect();
}

// AppClusterService.clusterize(bootstrap);
bootstrap()
  .then(() => logger.log(`[Server]: Server is listening on port ${PORT}...`))
  .catch((e) => {
    logger.error(`[Server]: Server setup failed: ${e.msg}...`);
  });
