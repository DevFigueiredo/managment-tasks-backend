import { Inject, Injectable, BadRequestException } from '@nestjs/common';
import { UpdateProjectUseCaseRequestDTO } from './update-project.use-case.dto';
import { ProjectRepository } from '../../infra/database/repositories/project.repository';
import { UpdateProjectUseCaseRequestDTOSchema } from './update-project.use-case.schema';
import { IProjectRepository } from '../../infra/database/repositories/interfaces/project.repository-interface';
import { DateTime } from 'luxon';

@Injectable()
export class UpdateProjectUseCase {
  constructor(
    @Inject(ProjectRepository)
    private readonly projectRepository: IProjectRepository.Repository,
  ) {}

  async execute(data: UpdateProjectUseCaseRequestDTO): Promise<void> {
    const parsedData = UpdateProjectUseCaseRequestDTOSchema.parse(data);

    // Fetch the current project to validate against existing data
    const currentProject = await this.projectRepository.getOne({ id: data.id });
    if (!currentProject) {
      throw new BadRequestException('Project not found');
    }

    const today = DateTime.now().startOf('day');
    const newEndDate = DateTime.fromISO(parsedData.endDate).startOf('day');
    const currentStartDate = DateTime.fromJSDate(
      currentProject.startDate,
    ).startOf('day');

    // Validation: endDate should not be less than today
    if (newEndDate < today) {
      throw new BadRequestException('End date cannot be in the past');
    }

    // Validation: endDate should not be before startDate
    if (newEndDate < currentStartDate) {
      throw new BadRequestException('End date cannot be before the start date');
    }

    // Proceed with the update if all validations pass
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
