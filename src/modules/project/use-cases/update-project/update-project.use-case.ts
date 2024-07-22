import { Inject, Injectable } from '@nestjs/common';
import { UpdateProjectUseCaseRequestDTO } from './update-project.use-case.dto';
import { ProjectRepository } from '../../infra/database/repositories/project.repository';
import { UpdateProjectUseCaseRequestDTOSchema } from './update-project.use-case.schema';
import { IProjectRepository } from '../../infra/database/repositories/interfaces/project.repository-interface';

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject(ProjectRepository)
    private readonly projectRepository: IProjectRepository.Repository,
  ) {}
  async execute(data: UpdateProjectUseCaseRequestDTO): Promise<void> {
    const parsedData = UpdateProjectUseCaseRequestDTOSchema.parse(data);

    await this.projectRepository.update(
      { id: data.id },
      {
        name: parsedData.name,
        description: parsedData.description,
        endDate: parsedData.endDate,
      },
    );
  }
}
