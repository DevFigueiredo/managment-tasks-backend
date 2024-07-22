import { Inject, Injectable } from '@nestjs/common';
import {
  CreateTaskUseCaseRequestDTO,
  CreateTaskUseCaseResponseDTO,
} from './create-task.use-case.dto';

import { CreateTaskUseCaseRequestDTOSchema } from './create-task.use-case.schema';
import { DateNow } from '@shared/utils/date-now';
import { TaskRepository } from '../../infra/database/repositories/task.repository';
import { ITaskRepository } from '../../infra/database/repositories/interfaces/task.repository-interface';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(TaskRepository)
    private readonly taskRepository: ITaskRepository.Repository,
  ) {}
  async execute(
    data: CreateTaskUseCaseRequestDTO,
  ): Promise<CreateTaskUseCaseResponseDTO> {
    const parsedData = CreateTaskUseCaseRequestDTOSchema.parse(data);

    const response = await this.taskRepository.create({
      title: parsedData.title,
      text: parsedData.text,
      startDate: DateNow(),
      endDate: parsedData.endDate,
      statusId: parsedData.statusId,
    });

    await this.taskRepository.addTaskToProject(response.id, data.projectId);

    return { id: response.id };
  }
}
