import { Inject, Injectable } from '@nestjs/common';

import { TaskRepository } from '@src/modules/task/infra/database/repositories/task.repository';
import {
  GetDetailTaskUseCaseRequestDTO,
  GetDetailTaskUseCaseResponseDTO,
} from './get-detail-task.use-case.dto';
import { ITaskRepository } from '../../infra/database/repositories/interfaces/task.repository-interface';

@Injectable()
export class GetDetailTaskUseCase {
  constructor(
    @Inject(TaskRepository)
    private readonly taskRepository: ITaskRepository.Repository,
  ) {}
  async execute(
    params: GetDetailTaskUseCaseRequestDTO,
  ): Promise<GetDetailTaskUseCaseResponseDTO> {
    const task = await this.taskRepository.getOne({
      id: params.id,
    });

    return task;
  }
}
