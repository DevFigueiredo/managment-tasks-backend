import {
  ArgumentsHost,
  HttpException,
  HttpServer,
  HttpStatus,
} from '@nestjs/common';
import { AllExceptionsFilter } from './all-exception.filter';
import { Logger } from '../../shared/utils/logger';
import { ZodError } from 'zod';
import { MockProxy, mock } from 'jest-mock-extended';

describe('AllExceptionsFilter', () => {
  let filter: AllExceptionsFilter;
  const url = 'http://any_url.com';
  const mockLogger: MockProxy<Logger> = mock();
  const httpServer: MockProxy<HttpServer> = mock();
  const responseFunction = jest.fn();

  const argumentsHost = {
    switchToHttp: jest.fn().mockReturnValue({
      getResponse: jest.fn().mockReturnValue({
        status: jest.fn().mockReturnValue({
          json: responseFunction,
        }),
      }),
      getRequest: jest.fn().mockReturnValue({
        url,
      }),
    }),
  } as unknown as ArgumentsHost;
  beforeEach(() => {
    jest.clearAllMocks();
    filter = new AllExceptionsFilter(httpServer, mockLogger);
  });

  it('should catch ZodError and respond with status 400 and error message', () => {
    const zodError = new ZodError([
      { message: 'First error message', code: 'custom', path: ['field'] },
    ]);

    filter.catch(zodError, argumentsHost);

    expect(mockLogger.warn).toHaveBeenCalledTimes(1);

    expect(responseFunction).toHaveBeenCalledTimes(1);
    expect(responseFunction).toHaveBeenCalledWith({
      message: `${zodError?.errors[0]?.message}`,
      path: url,
      statusCode: 400,
    });
  });

  it('should catch HttpException and respond with corresponding status and message', () => {
    const httpException = new HttpException('Not found', HttpStatus.NOT_FOUND);
    filter.catch(httpException, argumentsHost);

    expect(mockLogger.warn).toHaveBeenCalledTimes(1);
    expect(mockLogger.warn).toHaveBeenCalledWith(httpException.message, {
      labels: {
        url,
      },
    });

    expect(responseFunction).toHaveBeenCalledTimes(1);
    expect(responseFunction).toHaveBeenCalledWith({
      message: httpException.message,
      path: url,
      statusCode: HttpStatus.NOT_FOUND,
    });
  });

  it('should catch other exceptions and respond with status 500 and error message', () => {
    const error = new Error('Internal server error');
    filter.catch(error, argumentsHost);
    expect(responseFunction).toHaveBeenCalledTimes(1);
    expect(responseFunction).toHaveBeenCalledWith({
      message: 'Internal server error',
      path: url,
      statusCode: 500,
    });
    expect(mockLogger.error).toHaveBeenCalledTimes(1);
    expect(mockLogger.error).toHaveBeenCalledWith(error.message, {
      labels: {
        url,
      },
    });
  });
});
