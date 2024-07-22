import { Inject, Injectable } from '@nestjs/common';

import {
  GetStatusUseCaseRequestDTO,
  GetStatusUseCaseResponseDTO,
} from './get-status.use-case.dto';
import { StatusRepository } from '../../infra/database/repositories/status.repository';
import { IStatusRepository } from '../../infra/database/repositories/interfaces/status.repository-interface';

@Injectable()
export class GetStatusUseCase {
  constructor(
    @Inject(StatusRepository)
    private readonly taskRepository: IStatusRepository.Repository,
  ) {}
  async execute(
    params: GetStatusUseCaseRequestDTO,
  ): Promise<GetStatusUseCaseResponseDTO[]> {
    const tasks = await this.taskRepository.get({
      projectId: params.projectId,
    });

    return tasks;
  }
}
