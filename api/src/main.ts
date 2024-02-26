import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import CustomLogger from './utils/custom-logger';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

const logger = new CustomLogger('MAIN');

(async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  const configService = app.get(ConfigService);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: configService.get('CORS.ENABLED_ORIGINS'),
    methods: configService.get('CORS.ENABLED_METHODS'),
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });
  await app.listen(configService.get('PORT')).then(() => {
    logger.log(
      `API ${configService.get(
        'NODE_ENV',
      )} listening on port ${configService.get('PORT')}`,
    );
  });
})();
