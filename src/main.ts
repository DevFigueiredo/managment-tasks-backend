import configuration from '@shared/config/configuration';
import { AppModule } from './app.module';
import { createServer } from '@shared/utils/create-server';
import { Logger } from '@nestjs/common';

const config = configuration();
createServer(AppModule)()
  .then((app) => {
    app.listen(config.port, () => {
      Logger.debug('Server is running on http://localhost:' + config.port);
      Logger.debug(
        'Swagger is available at http://localhost:' + config.port + '/docs',
      );
    });
  })
  .catch((err) => Logger.error('Application broken', err));
