import { Inject, Injectable } from '@nestjs/common';
import {
  CreateProjectUseCaseRequestDTO,
  CreateProjectUseCaseResponseDTO,
} from './create-project.use-case.dto';
import { ProjectRepository } from '../../infra/database/repositories/project.repository';
import { CreateProjectUseCaseRequestDTOSchema } from './create-project.use-case.schema';
import { DateNow } from '@shared/utils/date-now';
import { IProjectRepository } from '../../infra/database/repositories/interfaces/project.repository-interface';
import { DateTime } from 'luxon';

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
    if (
      parsedData.endDate &&
      DateTime.fromISO(parsedData.endDate).startOf('day') <
        DateTime.now().startOf('day')
    ) {
      throw new Error('A data de término não pode ser menor que a data atual.');
    }

    if (parsedData.startDate && parsedData.endDate) {
      const startDate = DateTime.fromISO(parsedData.startDate).startOf('day');
      const endDate = DateTime.fromISO(parsedData.endDate).startOf('day');

      if (startDate > endDate) {
        throw new Error(
          'A data de início não pode ser maior que a data de término.',
        );
      }
    }
    const response = await this.projectRepository.create({
      name: parsedData.name,
      description: parsedData.description,
      startDate: parsedData.startDate || DateNow(),
      endDate: parsedData.endDate,
    });

    return { id: response.id };
  }
}
