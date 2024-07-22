import { Inject, Injectable } from '@nestjs/common';
import {
  CreateProjectUseCaseRequestDTO,
  CreateProjectUseCaseResponseDTO,
} from './create-project.use-case.dto';
import {
  IProjectRepository,
  ProjectRepository,
} from '../../repositories/project.repository';
import { CreateProjectUseCaseRequestDTOSchema } from './create-project.use-case.schema';
import { DateNow } from '@shared/utils/date-now';

@Injectable()
export class CreateProjectUseCase {
  constructor(
    @Inject(ProjectRepository)
    private readonly projectRepository: IProjectRepository.Repository,
  ) {}
  async execute(
    data: CreateProjectUseCaseRequestDTO,
  ): Promise<CreateProjectUseCaseResponseDTO> {
    const parsedData = CreateProjectUseCaseRequestDTOSchema.parse(data);

    const response = await this.projectRepository.create({
      name: parsedData.name,
      description: parsedData.description,
      startDate: DateNow(),
      endDate: parsedData.endDate,
    });

    return { id: response.id };
  }
}
