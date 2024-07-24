import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateTaskUseCaseRequestDTO } from './update-task.use-case.dto';
import { UpdateTaskUseCaseRequestDTOSchema } from './update-task.use-case.schema';
import { TaskRepository } from '../../infra/database/repositories/task.repository';
import { ITaskRepository } from '../../infra/database/repositories/interfaces/task.repository-interface';
import { IProjectRepository } from '@src/modules/project/infra/database/repositories/interfaces/project.repository-interface';
import { ProjectRepository } from '@src/modules/project/infra/database/repositories/project.repository';
import { StatusRepository } from '@src/modules/status/infra/database/repositories/status.repository';
import { IStatusRepository } from '@src/modules/status/infra/database/repositories/interfaces/status.repository-interface';
import { StatusTypeEnum } from '@shared/utils/enums/status.enum';
import { DateNow } from '@shared/utils/date-now';

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(StatusRepository)
    private readonly statusRepository: IStatusRepository.Repository,
    @Inject(TaskRepository)
    private readonly taskRepository: ITaskRepository.Repository,
    @Inject(ProjectRepository)
    private readonly projectRepository: IProjectRepository.Repository,
  ) {}

  async execute(data: UpdateTaskUseCaseRequestDTO): Promise<void> {
    const parsedData = UpdateTaskUseCaseRequestDTOSchema.parse(data);
    const task = await this.taskRepository.getOne({ id: data.id });
    if (!task) {
      throw new NotFoundException(`Task not found`);
    }

    const status = await this.statusRepository.getOne({ id: data.statusId });
    if (!status) {
      throw new NotFoundException(`Status not found`);
    }

    await this.validateProjectExistence(data.projectId);
    await this.taskRepository.update(
      { id: data.id },
      {
        title: parsedData.title,
        text: parsedData.text,
        startDate:
          !task.startDate && status.type === StatusTypeEnum.inprogress
            ? DateNow()
            : undefined,
        endDate: parsedData.endDate,
        statusId: parsedData.statusId,
      },
    );

    await this.taskRepository.removeTaskFromProject(data.id);
    await this.taskRepository.addTaskToProject(
      data.id,
      data.projectId,
      task.ProjectTask.find(
        (projectTask) =>
          projectTask.projectId == data.projectId &&
          projectTask.taskId == data.id,
      ).position,
    );
  }

  private async validateProjectExistence(projectId: string): Promise<void> {
    const project = await this.projectRepository.getOne({ id: projectId });
    if (!project) {
      throw new NotFoundException(`Project ID not found`);
    }
  }
}
