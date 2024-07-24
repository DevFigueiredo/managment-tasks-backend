import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '@shared/config/configuration';
import { StatusController } from './infra/http/controllers/status.controller';
import { GetStatusUseCase } from './use-cases/get-status/get-status.use-case';
import { StatusRepository } from './infra/database/repositories/status.repository';
import { DatabaseModule } from '@shared/infra/database/prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    DatabaseModule,
  ],
  controllers: [StatusController],
  providers: [GetStatusUseCase, StatusRepository],
})
export class StatusModule {}
