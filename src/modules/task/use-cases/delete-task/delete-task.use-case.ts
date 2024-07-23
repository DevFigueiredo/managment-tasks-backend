import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DeleteTaskUseCaseRequestDTO } from './delete-task.use-case.dto';
import { DeleteTaskUseCaseRequestDTOSchema } from './delete-task.use-case.schema';
import { TaskRepository } from '../../infra/database/repositories/task.repository';
import { ITaskRepository } from '../../infra/database/repositories/interfaces/task.repository-interface';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(TaskRepository)
    private readonly taskRepository: ITaskRepository.Repository,
  ) {}

  async execute(data: DeleteTaskUseCaseRequestDTO): Promise<void> {
    const parsedData = DeleteTaskUseCaseRequestDTOSchema.parse(data);

    const taskExists = await this.taskRepository.getOne({ id: parsedData.id });
    if (!taskExists) {
      throw new NotFoundException(`Task with ID ${parsedData.id} not found`);
    }

    await this.taskRepository.removeTaskFromProject(parsedData.id);
    await this.taskRepository.delete({ id: parsedData.id });
  }
}
