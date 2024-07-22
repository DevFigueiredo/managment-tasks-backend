import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from 'shared/config/configuration';
import { DatabaseModule } from 'shared/infra/database/prisma';
import { ProjectController } from './infra/http/controllers/projects.controller';
import { GetProjectsUseCase } from './use-cases/get-projects/get-projects.use-case';
import { CreateProjectUseCase } from './use-cases/create-project/create-project.use-case';
import { ProjectRepository } from './repositories/project.repository';
import { TaskRepository } from '../task/infra/database/repositories/task.repository';
import { UpdateProjectUseCase } from './use-cases/update-project/update-project.use-case';
import { GetDetailProjectUseCase } from './use-cases/get-detail-projects/get-detail-projects.use-case';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    DatabaseModule,
  ],
  controllers: [ProjectController],
  providers: [
    GetProjectsUseCase,
    CreateProjectUseCase,
    UpdateProjectUseCase,
    GetDetailProjectUseCase,
    ProjectRepository,
    TaskRepository,
  ],
})
export class ProjectModule {}
