import { Inject, Injectable } from '@nestjs/common';
import { ProjectRepository } from '../../infra/database/repositories/project.repository';
import { GetProjectUseCaseResponseDTO } from './get-projects.use-case.dto';
import { TaskRepository } from '@src/modules/task/infra/database/repositories/task.repository';
import { calculateCompletionPercentage } from '@shared/utils/calculate-percentage';
import { checkIfDelayed } from '@shared/utils/check-if-delayed';
import { ITaskRepository } from '@src/modules/task/infra/database/repositories/interfaces/task.repository-interface';
import { IProjectRepository } from '../../infra/database/repositories/interfaces/project.repository-interface';

@Injectable()
export class GetProjectsUseCase {
  constructor(
    @Inject(ProjectRepository)
    private readonly projectRepository: IProjectRepository.Repository,
    @Inject(TaskRepository)
    private readonly taskRepository: ITaskRepository.Repository,
  ) {}
  async execute(): Promise<GetProjectUseCaseResponseDTO[]> {
    const projects = await this.projectRepository.get();

    const projectsResponse = projects.map(async (project) => {
      const tasks = await this.taskRepository.get({ projectId: project.id });

      const completionPercentage = calculateCompletionPercentage(tasks);
      const isDelayed = checkIfDelayed(project.endDate, completionPercentage);
      return {
        ...project,
        completionPercentage: completionPercentage,
        isDelayed: isDelayed ? true : false,
      };
    });

    const projectsData = await Promise.all(projectsResponse);

    return projectsData;
  }
}
