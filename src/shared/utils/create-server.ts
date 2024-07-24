import * as express from 'express';
import * as fs from 'fs';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { useRequestLogging } from '../middlewares/logger-middleware';
import { AllExceptionsFilter } from '../filters/all-exception.filter';
import { Logger } from './logger';

let cachedServer: express.Express;
const isLocalhost = process.env.ENVIRONMENT === 'localhost';
const logger = new Logger();
export const createServer = (module: any) => {
  return async () => {
    if (!cachedServer) {
      const expressInstance = express();
      const app = await NestFactory.create(
        module,
        new ExpressAdapter(expressInstance),
        {
          logger: isLocalhost ? logger : false,
        },
      );
      const { httpAdapter } = app.get(HttpAdapterHost);
      app.useGlobalFilters(new AllExceptionsFilter(httpAdapter, logger));

      const config = new DocumentBuilder()
        .setTitle('Artis - API')
        .setDescription('Artis - API')
        .setVersion('1.0')
        .addServer('http://127.0.0.1:3000', 'URL Local')
        .build();

      const document = SwaggerModule.createDocument(app, config);
      SwaggerModule.setup('docs', app, document);
      //Salvar o json do swagger
      if (process.env.ENVIRONMENT === 'localhost')
        fs.writeFileSync(
          './src/shared/docs/swagger.json',
          JSON.stringify(document),
        );
      useRequestLogging(app);

      app.enableCors();
      await app.init();
      cachedServer = expressInstance;
    }
    return cachedServer;
  };
};
