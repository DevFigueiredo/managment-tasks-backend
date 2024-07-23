import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteProjectUseCaseRequestDTO } from './delete-project.use-case.dto';
import { DeleteProjectUseCaseRequestDTOSchema } from './delete-project.use-case.schema';
import { ITaskRepository } from '@src/modules/task/infra/database/repositories/interfaces/task.repository-interface';
import { TaskRepository } from '@src/modules/task/infra/database/repositories/task.repository';
import { ProjectRepository } from '../../infra/database/repositories/project.repository';
import { IProjectRepository } from '../../infra/database/repositories/interfaces/project.repository-interface';

@Injectable()
export class DeleteProjectUseCase {
  constructor(
    @Inject(TaskRepository)
    private readonly taskRepository: ITaskRepository.Repository,
    @Inject(ProjectRepository)
    private readonly projectRepository: IProjectRepository.Repository,
  ) {}

  async execute(data: DeleteProjectUseCaseRequestDTO): Promise<void> {
    const parsedData = DeleteProjectUseCaseRequestDTOSchema.parse(data);

    const projectExists = await this.projectRepository.getOne({
      id: parsedData.id,
    });
    if (!projectExists) {
      throw new NotFoundException(`Project not found`);
    }

    await this.taskRepository.deleteAll({ projectId: parsedData.id });
    await this.projectRepository.delete({ id: parsedData.id });
  }
}
