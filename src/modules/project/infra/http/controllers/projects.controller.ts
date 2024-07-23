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
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateProjectUseCase } from '@src/modules/project/use-cases/create-project/create-project.use-case';
import {
  CreateProjectUseCaseRequestDTO,
  CreateProjectUseCaseResponseDTO,
} from '@src/modules/project/use-cases/create-project/create-project.use-case.dto';
import { DeleteProjectUseCase } from '@src/modules/project/use-cases/delete-project/delete-project.use-case';
import { GetDetailProjectUseCase } from '@src/modules/project/use-cases/get-detail-projects/get-detail-projects.use-case';
import { GetDetailProjectUseCaseResponseDTO } from '@src/modules/project/use-cases/get-detail-projects/get-detail-projects.use-case.dto';
import { GetProjectsUseCase } from '@src/modules/project/use-cases/get-projects/get-projects.use-case';
import { GetProjectUseCaseResponseDTO } from '@src/modules/project/use-cases/get-projects/get-projects.use-case.dto';
import { UpdateProjectUseCase } from '@src/modules/project/use-cases/update-project/update-project.use-case';
import { UpdateProjectUseCaseRequestDTO } from '@src/modules/project/use-cases/update-project/update-project.use-case.dto';

@ApiTags('Project (Projeto)')
@Controller('projects')
export class ProjectController {
  constructor(
    private readonly getProjectsUseCase: GetProjectsUseCase,
    private readonly createProjectUseCase: CreateProjectUseCase,
    private readonly updateProjectUseCase: UpdateProjectUseCase,
    private readonly getDetailProjectUseCase: GetDetailProjectUseCase,
    private readonly deleteProjectUseCase: DeleteProjectUseCase,
  ) {}

  @Get()
  @ApiResponse({ type: GetProjectUseCaseResponseDTO, isArray: true })
  get(): Promise<GetProjectUseCaseResponseDTO[]> {
    return this.getProjectsUseCase.execute();
  }

  @ApiResponse({ type: CreateProjectUseCaseResponseDTO })
  @Post()
  create(
    @Body() body: CreateProjectUseCaseRequestDTO,
  ): Promise<CreateProjectUseCaseResponseDTO> {
    return this.createProjectUseCase.execute(body);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  update(
    @Body() body: UpdateProjectUseCaseRequestDTO,
    @Param('id') id: string,
  ): Promise<void> {
    return this.updateProjectUseCase.execute({ ...body, id });
  }

  @Get(':id')
  @ApiResponse({ type: GetDetailProjectUseCaseResponseDTO })
  getDetail(
    @Param('id') id: string,
  ): Promise<GetDetailProjectUseCaseResponseDTO> {
    return this.getDetailProjectUseCase.execute({ id });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<void> {
    return this.deleteProjectUseCase.execute({ id });
  }
}
