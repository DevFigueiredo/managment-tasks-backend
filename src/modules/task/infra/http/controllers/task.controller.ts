import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateTaskUseCase } from '@src/modules/task/use-cases/create-task/create-task.use-case';
import {
  CreateTaskUseCaseRequestDTO,
  CreateTaskUseCaseResponseDTO,
} from '@src/modules/task/use-cases/create-task/create-task.use-case.dto';
import { GetDetailTaskUseCase } from '@src/modules/task/use-cases/get-detail-task/get-detail-task.use-case';
import { GetDetailTaskUseCaseResponseDTO } from '@src/modules/task/use-cases/get-detail-task/get-detail-task.use-case.dto';
import { GetTaskUseCase } from '@src/modules/task/use-cases/get-tasks/get-task.use-case';
import { GetTaskUseCaseResponseDTO } from '@src/modules/task/use-cases/get-tasks/get-task.use-case.dto';

import { UpdateTaskUseCase } from '@src/modules/task/use-cases/update-task/update-task.use-case';
import { UpdateTaskUseCaseRequestDTO } from '@src/modules/task/use-cases/update-task/update-task.use-case.dto';

@ApiTags('Task (Tarefas)')
@Controller('tasks')
export class TaskController {
  constructor(
    private readonly getTasksUseCase: GetTaskUseCase,
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly getDetailTaskUseCase: GetDetailTaskUseCase,
  ) {}

  @Get()
  @ApiResponse({ type: GetTaskUseCaseResponseDTO, isArray: true })
  get(
    @Query('projectId') projectId: string,
  ): Promise<GetTaskUseCaseResponseDTO[]> {
    return this.getTasksUseCase.execute({ projectId });
  }

  @ApiResponse({ type: CreateTaskUseCaseResponseDTO })
  @Post()
  create(
    @Body() body: CreateTaskUseCaseRequestDTO,
  ): Promise<CreateTaskUseCaseResponseDTO> {
    return this.createTaskUseCase.execute(body);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Body() body: UpdateTaskUseCaseRequestDTO,
    @Param('id') id: string,
  ): Promise<void> {
    return this.updateTaskUseCase.execute({ ...body, id });
  }

  @Get(':id')
  @ApiResponse({ type: GetDetailTaskUseCaseResponseDTO })
  getDetail(@Param('id') id: string): Promise<GetDetailTaskUseCaseResponseDTO> {
    return this.getDetailTaskUseCase.execute({ id });
  }
}
