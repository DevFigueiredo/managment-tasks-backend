import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';
import { CreateTaskUseCase } from './use-cases/create-task.use-case';
import { TaskController } from './infra/http/controllers/task.controller';
import { DatabaseModule } from 'shared/infra/database/prisma';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    DatabaseModule,
  ],
  controllers: [TaskController],
  providers: [CreateTaskUseCase],
})
export class TaskModule {}
