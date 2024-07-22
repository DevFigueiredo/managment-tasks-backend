import { CreateTaskUseCase } from '@src/modules/task/use-cases/create-task.use-case';
import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Task (Tarefa)')
@Controller('tasks')
export class TaskController {
  constructor(private readonly createTaskUseCase: CreateTaskUseCase) {}

  @Get()
  create(): string {
    return this.createTaskUseCase.execute();
  }
}
