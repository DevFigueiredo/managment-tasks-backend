import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';
import { TaskController } from './infra/http/controllers/task.controller';
import { DatabaseModule } from 'shared/infra/database/prisma';
import { UpdateTaskUseCase } from './use-cases/update-task/update-task.use-case';
import { GetTaskUseCase } from './use-cases/get-tasks/get-task.use-case';
import { GetDetailTaskUseCase } from './use-cases/get-detail-task/get-detail-task.use-case';
import { DeleteTaskUseCase } from './use-cases/delete-task/delete-task.use-case';
import { TaskRepository } from './infra/database/repositories/task.repository';
import { CreateTaskUseCase } from './use-cases/create-task/create-task.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    DatabaseModule,
  ],
  controllers: [TaskController],
  providers: [
    CreateTaskUseCase,
    UpdateTaskUseCase,
    GetTaskUseCase,
    GetDetailTaskUseCase,
    DeleteTaskUseCase,
    TaskRepository,
  ],
})
export class TaskModule {}
