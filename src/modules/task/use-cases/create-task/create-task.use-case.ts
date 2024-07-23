import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateTaskUseCaseRequestDTO,
  CreateTaskUseCaseResponseDTO,
} from './create-task.use-case.dto';
import { CreateTaskUseCaseRequestDTOSchema } from './create-task.use-case.schema';
import { DateNow } from '@shared/utils/date-now';
import { TaskRepository } from '../../infra/database/repositories/task.repository';
import { ITaskRepository } from '../../infra/database/repositories/interfaces/task.repository-interface';
import { IProjectRepository } from '@src/modules/project/infra/database/repositories/interfaces/project.repository-interface';
import { ProjectRepository } from '@src/modules/project/infra/database/repositories/project.repository';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TaskRepository)
    private readonly taskRepository: ITaskRepository.Repository,
    @Inject(ProjectRepository)
    private readonly projectRepository: IProjectRepository.Repository,
  ) {}

  async execute(
    data: CreateTaskUseCaseRequestDTO,
  ): Promise<CreateTaskUseCaseResponseDTO> {
    const parsedData = CreateTaskUseCaseRequestDTOSchema.parse(data);

    await this.validateProjectExistence(parsedData.projectId);

    const response = await this.taskRepository.create({
      title: parsedData.title,
      text: parsedData.text,
      startDate: DateNow(),
      endDate: parsedData.endDate,
      statusId: parsedData.statusId,
    });

    await this.taskRepository.addTaskToProject(
      response.id,
      parsedData.projectId,
    );

    return { id: response.id };
  }

  private async validateProjectExistence(projectId: string): Promise<void> {
    const project = await this.projectRepository.getOne({ id: projectId });
    if (!project) {
      throw new NotFoundException(`Project with ID ${projectId} not found`);
    }
  }
}
