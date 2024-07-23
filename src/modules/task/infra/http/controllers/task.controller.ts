import {
  Body,
  Controller,
  Delete,
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
import { DeleteTaskUseCase } from '@src/modules/task/use-cases/delete-task/delete-task.use-case';
import { GetDetailTaskUseCase } from '@src/modules/task/use-cases/get-detail-task/get-detail-task.use-case';
import { GetDetailTaskUseCaseResponseDTO } from '@src/modules/task/use-cases/get-detail-task/get-detail-task.use-case.dto';
import { GetTaskUseCase } from '@src/modules/task/use-cases/get-tasks/get-task.use-case';
import { GetTaskUseCaseResponseDTO } from '@src/modules/task/use-cases/get-tasks/get-task.use-case.dto';
import { UpdatePositionTaskUseCase } from '@src/modules/task/use-cases/update-position-tasks/update-position-task.use-case';
import { UpdatePositionTaskUseCaseRequestDTO } from '@src/modules/task/use-cases/update-position-tasks/update-position-task.use-case.dto';

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
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly updatePositionTaskUseCase: UpdatePositionTaskUseCase,
  ) {}

  @Patch('positions')
  @HttpCode(HttpStatus.NO_CONTENT)
  updatePositions(
    @Body() body: UpdatePositionTaskUseCaseRequestDTO,
  ): Promise<void> {
    return this.updatePositionTaskUseCase.execute(body);
  }

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

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.deleteTaskUseCase.execute({ id });
  }
}
