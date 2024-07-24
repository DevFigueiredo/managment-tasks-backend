import { INestApplication } from '@nestjs/common';
import * as morganBody from 'morgan-body';
import { Logger } from '../utils/logger';

export function useRequestLogging(app: INestApplication) {
  const logger = new Logger();
  (morganBody as any)(app.getHttpAdapter().getInstance(), {
    stream: {
      write: (message: string) => {
        logger.info(message);
        return true;
      },
    },
    maxBodyLength: 10000,
    noColors: true,
    prettify: false,
    immediateReqLog: true,
    filterParameters: [
      'password',
      'apikey',
      'idToken',
      'refreshToken',
      'authorization',
      'authenticationtoken',
      'accesstoken',
      'token',
    ],
    logAllReqHeader: true,
    logResponseBody: true,
    logRequestId: false,
    logRequestBody: true,
    logIP: true,
  } as morganBody.IMorganBodyOptions);
}
