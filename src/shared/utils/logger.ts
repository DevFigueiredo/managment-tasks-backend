import { Injectable, LoggerService, Scope } from '@nestjs/common';
import * as winston from 'winston';

@Injectable({ scope: Scope.REQUEST })
export class Logger implements LoggerService {
  private logger: winston.Logger;
  constructor() {
    const isColorize = process.env.LOG_FORMAT == 'colorize';
    const colorfulFormat = winston.format.combine(
      winston.format((info) => {
        info.level = info.level.toUpperCase();
        return info;
      })(),
      winston.format.colorize({ all: true }),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      winston.format.label({
        label: '[MANAGMENT-PROJECT-ACTIVITIES]',
      }),
      winston.format.printf(
        (info) =>
          `${info.label}${info.requestId ? `[${info.requestId}]` : ''}[${info.timestamp}] [${info.level}]: ${info.message}`,
      ),
    );
    this.logger = winston.createLogger({
      level: 'debug',
      format: isColorize ? colorfulFormat : winston.format.json(),
      transports: [new winston.transports.Console()],
    });
  }
  info(message: any, optionalParams?: any) {
    this.logger.info(message, optionalParams);
  }
  log(message: any, optionalParams?: any) {
    this.logger.info(message, optionalParams);
  }
  error(message: any, optionalParams?: any) {
    this.logger.error(message, optionalParams);
  }
  warn(message: any, optionalParams?: any) {
    this.logger.warn(message, optionalParams);
  }
  debug?(message: any, optionalParams?: any) {
    this.logger.debug(message, optionalParams);
  }
  verbose?(message: any, optionalParams?: any) {
    this.logger.verbose(message, optionalParams);
  }
}
