import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UpdatePositionTaskUseCaseRequestDTO } from './update-position-task.use-case.dto';
import { UpdatePositionTaskUseCaseRequestDTOSchema } from './update-task.use-case.schema';
import { TaskRepository } from '../../infra/database/repositories/task.repository';
import { ITaskRepository } from '../../infra/database/repositories/interfaces/task.repository-interface';
import { IProjectRepository } from '@src/modules/project/infra/database/repositories/interfaces/project.repository-interface';
import { ProjectRepository } from '@src/modules/project/infra/database/repositories/project.repository';

@Injectable()
export class UpdatePositionTaskUseCase {
  constructor(
    @Inject(TaskRepository)
    private readonly taskRepository: ITaskRepository.Repository,
    @Inject(ProjectRepository)
    private readonly projectRepository: IProjectRepository.Repository,
  ) {}

  async execute(data: UpdatePositionTaskUseCaseRequestDTO): Promise<void> {
    const parsedData = UpdatePositionTaskUseCaseRequestDTOSchema.parse(data);

    await this.validateProjectExistence(data.projectId);
    await this.validateTaskExistence(
      data.projectId,
      parsedData.tasks.map((task) => task.taskId),
    );
    this.validateUniquePositions(parsedData.tasks.map((task) => task.position));

    await this.taskRepository.updateTaskPositions({
      projectId: parsedData.projectId,
      tasks: data.tasks,
    });
  }

  private async validateProjectExistence(projectId: string): Promise<void> {
    const projectExist = await this.projectRepository.getOne({ id: projectId });
    if (!projectExist) {
      throw new BadRequestException(`Project with ID ${projectId} not found`);
    }
  }

  private async validateTaskExistence(
    projectId: string,
    taskIds: string[],
  ): Promise<void> {
    const existingTasks = await this.taskRepository.get({ projectId });
    const existingTaskIds = new Set(existingTasks.map((task) => task.id));

    const nonExistentTasks = taskIds.filter(
      (taskId) => !existingTaskIds.has(taskId),
    );
    if (nonExistentTasks.length > 0) {
      throw new BadRequestException(
        `Task(s) not found: ${nonExistentTasks.join(', ')}`,
      );
    }
  }

  private validateUniquePositions(positions: number[]): void {
    const uniquePositions = new Set(positions);
    if (uniquePositions.size !== positions.length) {
      const duplicatePositions = positions.filter(
        (position, index) => positions.indexOf(position) !== index,
      );
      throw new BadRequestException(
        `Duplicate position(s) found: ${[...new Set(duplicatePositions)].join(', ')}`,
      );
    }
  }
}
