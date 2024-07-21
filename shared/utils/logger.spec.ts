import { Logger } from './Logger';
import * as winston from 'winston';
describe('Logger', () => {
  let logger: Logger;

  beforeEach(() => {
    const createLogger = jest.fn().mockReturnValue({
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    });

    const transports = {
      Console: jest.fn(),
    };

    Object.assign(winston, {
      // format,
      createLogger,
      transports,
    });
    logger = new Logger();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create winston logger with correct format and transports', () => {
    expect(winston.createLogger).toHaveBeenCalledWith({
      format: expect.anything(),
      transports: [new winston.transports.Console()],
    });
  });

  it('should call winston logger methods with correct arguments', () => {
    logger.info('Test log message');
    expect(winston.createLogger().info).toHaveBeenCalledWith(
      'Test log message',
      undefined,
    );
    logger.info('Test info message');
    expect(winston.createLogger().info).toHaveBeenCalledWith(
      'Test info message',
      undefined,
    );

    logger.error('Test error message');
    expect(winston.createLogger().error).toHaveBeenCalledWith(
      'Test error message',
      undefined,
    );

    logger.warn('Test warn message');
    expect(winston.createLogger().warn).toHaveBeenCalledWith(
      'Test warn message',
      undefined,
    );

    logger.debug('Test debug message');
    expect(winston.createLogger().debug).toHaveBeenCalledWith(
      'Test debug message',
      undefined,
    );

    logger.verbose('Test verbose message');
    expect(winston.createLogger().verbose).toHaveBeenCalledWith(
      'Test verbose message',
      undefined,
    );
  });

  it('should call winston logger methods with correct arguments with parameters', () => {
    logger.info('Test log message', { example: `any_example` });
    expect(winston.createLogger().info).toHaveBeenCalledWith(
      'Test log message',
      { example: `any_example` },
    );
    logger.info('Test info message', { example: `any_example` });
    expect(winston.createLogger().info).toHaveBeenCalledWith(
      'Test info message',
      { example: `any_example` },
    );

    logger.error('Test error message', { example: `any_example` });
    expect(winston.createLogger().error).toHaveBeenCalledWith(
      'Test error message',
      { example: `any_example` },
    );

    logger.warn('Test warn message', { example: `any_example` });
    expect(winston.createLogger().warn).toHaveBeenCalledWith(
      'Test warn message',
      { example: `any_example` },
    );

    logger.debug('Test debug message', { example: `any_example` });
    expect(winston.createLogger().debug).toHaveBeenCalledWith(
      'Test debug message',
      { example: `any_example` },
    );

    logger.verbose('Test verbose message', { example: `any_example` });
    expect(winston.createLogger().verbose).toHaveBeenCalledWith(
      'Test verbose message',
      { example: `any_example` },
    );
  });
});
