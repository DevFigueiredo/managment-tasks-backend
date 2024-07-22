import { Inject, Injectable } from '@nestjs/common';
import { UpdateTaskUseCaseRequestDTO } from './update-task.use-case.dto';

import { UpdateTaskUseCaseRequestDTOSchema } from './update-task.use-case.schema';
import { TaskRepository } from '../../infra/database/repositories/task.repository';
import { ITaskRepository } from '../../infra/database/repositories/interfaces/task-repository-interface';

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(TaskRepository)
    private readonly taskRepository: ITaskRepository.Repository,
  ) {}
  async execute(data: UpdateTaskUseCaseRequestDTO): Promise<void> {
    const parsedData = UpdateTaskUseCaseRequestDTOSchema.parse(data);

    const response = await this.taskRepository.update(
      { id: data.id },
      {
        title: parsedData.title,
        text: parsedData.text,
        endDate: parsedData.endDate,
      },
    );

    await this.taskRepository.removeTaskFromProject(response.id);
    await this.taskRepository.addTaskToProject(response.id, data.projectId);
  }
}
