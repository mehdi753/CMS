import { NestFactory } from '@nestjs/core';
import { CommandModule, CommandService } from 'nestjs-command';
import { AppModule } from './app.module';
import CustomLogger from './utils/custom-logger';

const logger = new CustomLogger('CLI');

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule, { logger });
  try {
    await app.select(CommandModule).get(CommandService).exec();
    await app.close();
  } catch (error) {
    logger.error(error);
    await app.close();
    process.exit(1);
  }
}

bootstrap();
