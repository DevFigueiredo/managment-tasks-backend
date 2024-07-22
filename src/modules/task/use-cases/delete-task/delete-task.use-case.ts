import { Inject, Injectable } from '@nestjs/common';
import { DeleteTaskUseCaseRequestDTO } from './delete-task.use-case.dto';

import { DeleteTaskUseCaseRequestDTOSchema } from './delete-task.use-case.schema';
import { TaskRepository } from '../../infra/database/repositories/task.repository';
import { ITaskRepository } from '../../infra/database/repositories/interfaces/task-repository-interface';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(TaskRepository)
    private readonly taskRepository: ITaskRepository.Repository,
  ) {}
  async execute(data: DeleteTaskUseCaseRequestDTO): Promise<void> {
    const parsedData = DeleteTaskUseCaseRequestDTOSchema.parse(data);

    await this.taskRepository.removeTaskFromProject(parsedData.id);
    await this.taskRepository.delete({ id: data.id });
  }
}
