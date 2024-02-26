import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import Config from './configurations/config';
import { AuthModule } from './modules/auth/auth.module';
import { redisStore } from 'cache-manager-redis-store';
import { CacheModule } from '@nestjs/cache-manager';
import type { RedisClientOptions } from 'redis';
import { PropertiesModule } from './modules/properties/properties.module';
import { WebsitesModule } from './modules/websites/websites.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { FeaturesModule } from './modules/features/features.module';
import { PagesModule } from './modules/pages/pages.module';
import { MigrationService } from './migration/migration.service';
import { CommandModule } from 'nestjs-command';
import { MigrationCommand } from './migration/migration.command';
import { StorageModule } from './modules/storage/storage.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PagesModule,
    MailerModule,
    CommandModule,
    WebsitesModule,
    FeaturesModule,
    PropertiesModule,
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dest: configService.get('UPLOADS_DIR_PATH'),
        limits: {
          fileSize: Number(configService.get('MAX_FILE_SIZE')),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [Config],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: `${config.get('MONGO.SCHEME')}://${config.get(
          'MONGO.DOMAIN',
        )}:${config.get('MONGO.PORT')}/${config.get('MONGO.DATABASE_NAME')}`,
      }),
      inject: [ConfigService],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        store: async () =>
          await redisStore({
            socket: {
              host: config.get('REDIS.HOST'),
              port: config.get('REDIS.PORT'),
            },
          }),
      }),
      inject: [ConfigService],
    }),
    StorageModule,
  ],
  controllers: [AppController],
  providers: [AppService, MigrationService, MigrationCommand],
})
export class AppModule {}
