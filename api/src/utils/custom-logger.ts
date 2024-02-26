import { ConsoleLogger, ConsoleLoggerOptions } from '@nestjs/common';
import { ENV } from 'src/@types/env';

export default class CustomLogger extends ConsoleLogger {
  constructor(context?: string, options?: ConsoleLoggerOptions) {
    super(context, options);
  }

  log(message: string): void {
    if (process.env.NODE_ENV !== ENV.TEST) super.log(message, this.context);
  }

  error(message: string, stack?: string): void {
    if (process.env.NODE_ENV !== ENV.TEST)
      super.error(message, stack, this.context);
  }

  warn(message: string): void {
    if (process.env.NODE_ENV !== ENV.TEST) super.error(message, this.context);
  }

  debug(message: string): void {
    if (
      process.env.NODE_ENV !== ENV.TEST &&
      (process.env.NODE_ENV === ENV.DEVELOPMENT || process.env.DEBUG_MODE)
    )
      super.debug(message, this.context);
  }

  verbose(message: string): void {
    if (process.env.NODE_ENV !== ENV.TEST) super.verbose(message, this.context);
  }
}
