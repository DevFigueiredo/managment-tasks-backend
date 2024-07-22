import { Inject, Injectable } from '@nestjs/common';

import {
  GetTaskUseCaseRequestDTO,
  GetTaskUseCaseResponseDTO,
} from './get-task.use-case.dto';
import { TaskRepository } from '@src/modules/task/infra/database/repositories/task.repository';
import { ITaskRepository } from '../../infra/database/repositories/interfaces/task.repository-interface';

@Injectable()
export class GetTaskUseCase {
  constructor(
    @Inject(TaskRepository)
    private readonly taskRepository: ITaskRepository.Repository,
  ) {}
  async execute(
    params: GetTaskUseCaseRequestDTO,
  ): Promise<GetTaskUseCaseResponseDTO[]> {
    const tasks = await this.taskRepository.get({
      projectId: params.projectId,
    });

    return tasks;
  }
}
