import * as migrate from 'migrate';
import { Injectable } from '@nestjs/common';
import CustomLogger from 'src/utils/custom-logger';
import { exec } from 'child_process';
import MongoStateStore from './utils/mongo-store';
import { ConfigService } from '@nestjs/config';
const logger = new CustomLogger('MIGRATION-SERVICE');

@Injectable()
export class MigrationService {
  constructor(private readonly config: ConfigService) {}

  make(title: string): void {
    try {
      exec(
        `migrate create ${title} --compiler="ts:./src/migration/utils/ts-compiler.js" --migrations-dir="./src/migration/_migrations" --template-file="src/migration/utils/template.ts"`,
        (error, stdout, stderr) => {
          if (error) logger.error(error.message);
          if (stderr) logger.error(stderr);
          logger.log(stdout);
        },
      );
    } catch (e) {
      logger.error(e);
      logger.debug('creating migration failed...');
    }
  }

  migrate(): void {
    try {
      logger.debug('start migration...');
      migrate.load(
        {
          migrationsDirectory: this.config.get('MIGRATION_DIR_PATH'),
          stateStore: new MongoStateStore(),
        },
        (error, set) => {
          if (error) throw error;
          set.up((e) => {
            if (e) throw e;
            logger.log('Migrations successfully ran.');
            logger.debug('migration ended...');
          });
        },
      );
    } catch (e) {
      logger.error(e);
      logger.debug('migration ended...');
    }
  }

  evacuate(): void {
    try {
      logger.debug('start reverting migration...');
      migrate.load(
        {
          migrationsDirectory: this.config.get('MIGRATION_DIR_PATH'),
          stateStore: new MongoStateStore(),
        },
        (error, set) => {
          if (error) throw error;
          set.down((e) => {
            if (e) throw e;
            logger.log('Migrations successfully reverted.');
            logger.debug('revert ended...');
          });
        },
      );
    } catch (e) {
      logger.error(e);
      logger.debug('revert ended...');
    }
  }

  run(title: string): void {
    try {
      logger.debug('start migration...');
      migrate.load(
        {
          migrationsDirectory: this.config.get('MIGRATION_DIR_PATH'),
          stateStore: new MongoStateStore(),
        },
        (error, set) => {
          if (error) throw error;
          set.up(title, (e) => {
            if (e) throw e;
            logger.log('Migrations successfully ran.');
            logger.debug('migration ended...');
          });
        },
      );
    } catch (e) {
      logger.error(e);
      logger.debug('migration ended...');
    }
  }
}
