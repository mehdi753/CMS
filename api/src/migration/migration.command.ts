import { Command, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { createInterface } from 'readline';
import { MigrationService } from './migration.service';

@Injectable()
export class MigrationCommand {
  constructor(private readonly migrationService: MigrationService) {}

  @Command({
    command: 'migrate',
    describe: `Migrate database CLI command
    [dev] command: npx nestjs-command migrate
    [prod/staging] command: node dist/src/cli.js migrate`,
  })
  async migrate(): Promise<void> {
    await this.migrationService.migrate();
  }

  @Command({
    command: 'evacuate',
    describe: `Revert migration database CLI command
    [dev] command: npx nestjs-command evacuate
    [prod/staging] command: node dist/src/cli.js evacuate`,
  })
  async evacuate(): Promise<void> {
    await this.migrationService.evacuate();
  }

  @Command({
    command: 'make:migration',
    describe: `Create migration database CLI command
    [dev] command: npx nestjs-command make:migration -t <title><title>
    [prod/staging] command: node dist/src/cli.js make:migration -t <title>`,
  })
  async create(
    @Option({
      name: 'title',
      describe: 'Migration name (words should be separated by "-")',
      type: 'string',
      alias: 't',
    })
    title: string,
  ): Promise<void> {
    if (title) {
      await this.migrationService.make(title);
    } else {
      const readline = createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      readline.question(
        `Enter migration name: (words should be separated by "-") `,
        async (name) => {
          await this.migrationService.make(name);
          readline.close();
        },
      );
    }
  }

  @Command({
    command: 'run:migration',
    describe: `Run a specific migration database CLI command
    [dev] command: npx nestjs-command run:migration -t <title><title>
    [prod/staging] command: node dist/src/cli.js run:migration -t <title>`,
  })
  async run(
    @Option({
      name: 'title',
      describe: 'Migration name (words should be separated by "-")',
      type: 'string',
      alias: 't',
    })
    title: string,
  ): Promise<void> {
    if (title) {
      await this.migrationService.run(title);
    } else {
      const readline = createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      readline.question(
        `Enter migration name: (words should be separated by "-") `,
        async (name) => {
          await this.migrationService.run(name);
          readline.close();
        },
      );
    }
  }
}
